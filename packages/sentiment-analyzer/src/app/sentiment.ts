import aposToLexForm from "./aposToLexForm";
import {WordTokenizer, SentimentAnalyzer, PorterStemmer} from "natural";
import { removeStopwords } from "stopword";


export const analyzeSentiment = (text: string) => {


  // limpiar las expressiones abreviadas del ingles como I'm I've You're etc

  const cleanText = aposToLexForm(text);

  //Transformar el texto a minusculas

  const lowercaseText = cleanText.toLowerCase();

  //Reemplazar los caracteres no Alfabeticos

  const charactersText = lowercaseText.replace(/[^a-z0-9]+/gi, " ");

  //Tokenizar el texto en un array de palabras: ["I", "like","apples"]

  const tokenizer = new WordTokenizer();
  const tokenizedText = tokenizer.tokenize(charactersText);

  //Eliminar las stopwords, aquellas palabras que no aportan significado a una frase (he, like, have, etc)

  const nostopwordsText = removeStopwords(tokenizedText);


  //analizar el sentimiento del texto y devolver la puntuacion

  const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

  return analyzer.getSentiment(nostopwordsText);
}
