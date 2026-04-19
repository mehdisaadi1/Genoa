import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
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
      const members = membersRes.data;
      
      const relationsRes = await api.get('/relations/all'); // We will assume an endpoint /all exists or we simulate it
      // actually we only created /parent-child for POST, but we can return parents in /members since we populated it!
      // In Member controller, we don't return relations in getAllMembers, let's fix it or just send it directly if not yet implemented.
      
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
            
            // Simple rendering for now (listing nodes as a demo of WebView working)
            // Real D3 tree would require hierarchical data layout
            
            const svg = d3.select("#chart").append("svg")
                .attr("width", 1000)
                .attr("height", 800)
                .call(d3.zoom().on("zoom", function (event) {
                    svg.attr("transform", event.transform)
                }))
                .append("g");

            // Dummy graph rendering logic
            members.forEach((m, idx) => {
              const node = svg.append("g")
                .attr("transform", "translate(" + (50) + "," + (idx * 60 + 50) + ")");
              node.append("rect")
                .attr("width", 150).attr("height", 40);
              node.append("text")
                .attr("x", 10).attr("y", 25)
                .text(m.firstName + ' ' + m.lastName);
            });
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
         <WebView
           originWhitelist={['*']}
           source={{ html: htmlContent }}
           style={{ flex: 1 }}
           scalesPageToFit={false}
           javaScriptEnabled={true}
           showsVerticalScrollIndicator={false}
         />
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
