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
const LabelFL = ({ product, user, shop }) => (
  <Document>
    <Page size="A5" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.bold}>MADE IN A COTTAGE FOOD OPERATION</Text>
        <Text style={styles.bold}>THAT IS NOT SUBJECT</Text>
        <Text style={styles.bold}>{"TO FLORIDA\'S FOOD SAFETY REGULATIONS"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={(styles.bold, styles.big)}>{product.name}</Text>
      </View>
      <View style={styles.section}>
        <Text>{user.firstName} {user.lastName}</Text>
        <Text>{shop.pickupAddress.street}{shop.pickupAddress.street2 && ` ${shop.pickupAddress.street2}`}</Text>
        <Text>{shop.pickupAddress.city}, {shop.pickupAddress.state} {shop.pickupAddress.zipcode}</Text>
      </View>
      <View style={styles.section}>
        <Text>
          Ingredients: {product.ingredients.map(
            (ingredient, index) => ingredient.name + (index !== product.ingredients.length-1 ? ',' : '')
          )}
        </Text>
      </View>
      {product.ingredients.filter(ingredient => ingredient.allergen).length > 0 &&
        <View style={styles.section}>
          <Text>Contains: {product.ingredients.filter(ingredient => ingredient.allergen).map(
              (ingredient, index) => ingredient.name + (index !== product.ingredients.length-1 ? ',' : '')
            )}</Text>
        </View>
      }
      <View style={styles.section}>
        <Text style={styles.bold}>Net Wt. {Number(product.weight).toFixed(1)} oz</Text>
      </View>
    </Page>
  </Document>
);

export default LabelFL