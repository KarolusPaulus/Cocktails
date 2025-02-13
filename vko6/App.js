import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';

const SEARCH_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const LOOKUP_URL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

export default function App() {
  const [search, setSearch] = useState('');
  const [cocktails, setCocktails] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);


  const searchCocktails = () => {
    if (!search.trim()) return;

    fetch(SEARCH_URL + search)
      .then((response) => response.json())
      .then((data) => {
        if (data.drinks) {
          setCocktails(data.drinks);
          setSelectedCocktail(null);
        } else {
          setCocktails([]);
          setSelectedCocktail(null);
        }
      })
      .catch((error) => console.error(error));
  };

  const getCocktailDetails = (id) => {
    fetch(LOOKUP_URL + id)
      .then((response) => response.json())
      .then((data) => {
        if (data.drinks) {
          setSelectedCocktail(data.drinks[0]);
        }
      })
      .catch((error) => console.error(error));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => getCocktailDetails(item.idDrink)}>
      <Text style={styles.cocktail}>{item.strDrink}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Cocktails</Text>
      <TextInput
        style={styles.input}
        placeholder="Search cocktail"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={searchCocktails}
      />

      {cocktails.length > 0 && !selectedCocktail && (
        <FlatList
          data={cocktails}
          renderItem={renderItem}
          keyExtractor={(item) => item.idDrink.toString()}
        />
      )}

      {selectedCocktail && (
        <View style={styles.details}>
          <Text style={styles.detailsTitle}>{selectedCocktail.strDrink}</Text>
          <Text style={styles.text}>Glass: {selectedCocktail.strGlass}</Text>
          <Text style={styles.text}>Instructions: {selectedCocktail.strInstructions}</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB2C9',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#872B46'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#FF578A',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FF9FBC',
    color: '#872B46'
  },
  cocktail: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF578A',
    color: '#872B46',
    textAlign: 'center'
  },
  details: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FF578A',
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#FF9FBC',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#872B46'
  },
  text: {
    color: '#872B46'
  }
});
