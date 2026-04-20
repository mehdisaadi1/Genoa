import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, Button, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function TreeScreen({ navigation }) {
  const [htmlContent, setHtmlContent] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTreeAndRender();
  }, []);

  const fetchTreeAndRender = async () => {
    try {
      // Pour faire très simple sans bibliothèques lourdes D3 natives sur le webview :
      // On récupère les membres et on crée un code JS/HTML qui inclut D3.js via un CDN
      const membersRes = await api.get('/members');
      const relationsRes = await api.get('/relations');
      const members = membersRes.data;
      const { parentChildren } = relationsRes.data || { parentChildren: [] };
      const treeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5">
          <script src="https://d3js.org/d3.v7.min.js"></script>
          <style>
            body { font-family: sans-serif; background-color: #F5F7FA; margin:0; padding:10px; }
            .node rect { fill: #fff; stroke: steelblue; stroke-width: 2px; rx: 5; ry: 5; }
            .node text { font: 12px sans-serif; fill: #333; }
            .link { fill: none; stroke: #ccc; stroke-width: 2px; }
          </style>
      </head>
      <body>
          <div id="chart"></div>
          <script>
            // Data injection from React Native
            const members = ${JSON.stringify(members)};
            const parentChildren = ${JSON.stringify(parentChildren)};
            
            const nodes = members.map(m => ({ id: m.id, name: m.firstName + ' ' + m.lastName }));
            const links = parentChildren.map(r => ({ source: r.parentId, target: r.childId }));
            
            const svg = d3.select("#chart").append("svg")
                .attr("width", 1000)
                .attr("height", 800)
                .call(d3.zoom().on("zoom", function (event) {
                    svg.attr("transform", event.transform)
                }))
                .append("g");
                
            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).distance(150))
                .force("charge", d3.forceManyBody().strength(-400))
                .force("center", d3.forceCenter(500, 400));
                
            const link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .attr("class", "link");
                
            const node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
                    
            node.append("rect")
                .attr("width", 120).attr("height", 36)
                .attr("x", -60).attr("y", -18);
                
            node.append("text")
                .attr("dy", 4)
                .attr("text-anchor", "middle")
                .text(d => d.name);
                
            simulation.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
                    
                node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
            });
            
            function dragstarted(event, d) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x; d.fy = d.y;
            }
            function dragged(event, d) {
              d.fx = event.x; d.fy = event.y;
            }
            function dragended(event, d) {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null; d.fy = null;
            }
          </script>
      </body>
      </html>
      `;
      setHtmlContent(treeHtml);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
       <View style={styles.header}>
         <Button title="Ajouter Membre" onPress={() => navigation.navigate('MemberForm')} />
       </View>
       {htmlContent ? (
         Platform.OS === 'web' ? (
           <iframe srcDoc={htmlContent} style={{ flex: 1, border: 'none', width: '100%', height: '100vh' }} />
         ) : (
           <WebView
             originWhitelist={['*']}
             source={{ html: htmlContent }}
             style={{ flex: 1 }}
             scalesPageToFit={false}
             javaScriptEnabled={true}
             showsVerticalScrollIndicator={false}
           />
         )
       ) : (
         <Text>Loading Tree...</Text>
       )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 10, backgroundColor: '#FFF', elevation: 2 }
});
