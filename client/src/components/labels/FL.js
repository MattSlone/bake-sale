import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  section: {
    margin: 5,
    padding: 5,
    textAlign: 'center'
  },
  bold: {
    fontWeight: 'bold'
  },
  big: {
    fontSize: '42pt'
  },
});

// Create Document Component
const LabelFL = () => (
  <Document>
    <Page size="A5" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.bold}>MADE IN A COTTAGE FOOD OPERATION</Text>
        <Text style={styles.bold}>THAT IS NOT SUBJECT</Text>
        <Text style={styles.bold}>TO FLORIDA’S FOOD SAFETY REGULATIONS</Text>
      </View>
      <View style={styles.section}>
        <Text style={(styles.bold, styles.big)}>Chocolate Chip Cookie</Text>
      </View>
      <View style={styles.section}>
        <Text>Ashley Christopher Bryant</Text>
        <Text>1019 Food Safety Drive</Text>
        <Text>Tallahassee, Florida 32399</Text>
      </View>
      <View style={styles.section}>
        <Text>
          Ingredients: Enriched flour (Wheat flour, niacin, reduced iron, thiamine, mononitrate, riboflavin and folic acid), butter
          (milk, salt), chocolate chips (sugar, chocolate liquor, cocoa butter, butterfat (milk), Soy lecithin as an emulsifier),
          walnuts, sugar, eggs, salt, artificial vanilla extract, baking soda. 
        </Text>
      </View>
      <View style={styles.section}>
        <Text>Contains: wheat, eggs, milk, soy, walnuts </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Net Wt. 3 oz</Text>
      </View>
    </Page>
  </Document>
);

export default LabelFL