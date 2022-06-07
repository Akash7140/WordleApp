import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from 'react-native';
import { colors, CLEAR, ENTER } from './src/constants';
import Keyboard from './src/components/Keyboard/Keyboard';
import { useState, useEffect } from 'react';

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])]
}

export default function App() {

  const word = "hello";
  const letters = word.split('')

  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(
    new Array(letters.length).fill("")
  ));

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing');

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  const checkGameState = () => {
    if (checkIfWon()) {
      Alert.alert('Winner', 'you won!!')
      setGameState('won');
    }
    else if (checkIfLost()) {
      Alert.alert('Game Over', 'Try again tommorow');
      setGameState('lost');
    }
  }

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === letters[i]);
  }

  const checkIfLost = () => {
    return curRow === rows.length;
  }


  const onKeyPressed = (key) => {

    if (gameState !== 'playing') {
      return;
    }

    const updatedRows = copyArray(rows)

    if (key === CLEAR && curCol !== 0) {
      const prevCol = curCol - 1;
      updatedRows[curRow][prevCol] = "";
      setRows(updatedRows);
      setCurCol(prevCol);

    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }

      return;
    }

    if (curCol < rows[0].length && key !== CLEAR) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  }

  const isActiveCell = (row, col) => {
    return row === curRow && col === curCol;
  }

  const getColBGColor = (letter, row, col) => {

    if (row >= curRow) {
      return colors.black;
    }

    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  }

  const greenCaps = rows.flatMap((row, i) => row.filter((cell, j) => getColBGColor(cell, i, j) === colors.primary));
  const yellowCaps = rows.flatMap((row, i) => row.filter((cell, j) => getColBGColor(cell, i, j) === colors.secondary));
  const greyCaps = rows.flatMap((row, i) => row.filter((cell, j) => getColBGColor(cell, i, j) === colors.darkgrey));


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>


      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) =>
            (<View key={`cell-${i}-${j}`} style={[styles.cell,
            {
              borderColor: isActiveCell(i, j) ? colors.lightgrey : colors.darkgrey,
              backgroundColor: getColBGColor(letter, i, j)
            }
            ]}>
              <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
            </View>))}
          </View>
        ))}
      </ScrollView>



      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    paddingVertical: 15,

  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginTop: 10
  },
  map: {
    height: 100,
    alignSelf: 'stretch',
    marginVertical: 10

  },
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: colors.darkgrey,
    margin: 3,
    maxWidth: 65,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28
  }
});
