import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage
} from 'react-native';
import ToDo from "./ToDo";
import { AppLoading } from 'expo';
import uuid from 'react-native-uuid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {

  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  };

  componentDidMount = () => {
    this._loadToDos();
  }

  render() {
      const { newToDo, loadedToDos, toDos } = this.state;

      if(!loadedToDos){
       return <AppLoading />;
      }

      return (
        <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
      <Text style={styles.title}>
        Daily To Do List
      </Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder={"오늘의 할 일을 작성해 보세요"}
          value={newToDo}
          onChangeText={this._controlNewToDo}
          placeholderTextColor={"#d1caca"}
          returnKeyType={"done"}
          autoCorrect={false}
          onSubmitEditing={this._addToDos}
        />
      {/* <ScrollView contentContainerStyle={styles.toDos}> */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.toDos}
        extraScrollHeight={130}
        >
          {Object.values(toDos).reverse().map(toDo =>
            (<ToDo 
              key={toDo.id} 
              deleteToDo={this._deleteToDo} 
              uncompleteToDo={this._uncompleteToDo}
              updateToDo={this._updateToDo}
              completeToDo={this._completeToDo}          
              {...toDo} />)
              )}
        </KeyboardAwareScrollView>
        {/* </ScrollView> */}
      </View>
    </View>);
  }

  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };

  _loadToDos = async () => {
    try{
      const toDos =  await AsyncStorage.getItem("toDos");
      setTimeout( () => this.setState({
        loadedToDos: true,
        toDos: JSON.parse(toDos) || {}
      }),2000);
    }catch(err) {
      console.log(err);
    }

  };

  _addToDos = () => {
    const {newToDo} = this.state;
    if(newToDo !== ""){
      this.setState(prevState => {
        
        const ID = uuid.v1();
        
        const newToDoObject = {
          [ID]:{
            id:ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);
        return {...newState }
      });
    }
  };

  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];

      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    })
    
  };
  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  };
  _completeToDo = id => {
    this.setState(prevState => {
      console.log(prevState.toDos);
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]: {// id가 있으면 업데이트
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      console.log(newState.toDos);
      return {...newState};
    })
  };
  _updateToDo = (id,text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]: {// id가 있으면 업데이트
            ...prevState.toDos[id],
            text:text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  };
  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1eb2a6',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 20,
    marginTop: 50,
    fontWeight: "500",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 20

  },
  toDos: {
    alignItems: "center"
  }
});
