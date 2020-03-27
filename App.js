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
  AsyncStorage,
  TouchableOpacity
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
      // console.log('render:',toDos);
      if(!loadedToDos){
       return <AppLoading />;
      }

      return (
        <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
      <Text style={styles.title}>
        Daily To Do
      </Text>
      <View style={styles.card}>
        <View style={styles.inputBox}>
          <View style={styles.column}>
            <TextInput
              style={styles.input}
              placeholder={"오늘의 할 일을 작성해 보세요"}
              value={newToDo}
              onChangeText={this._controlNewToDo}
              placeholderTextColor={"#d1caca"}
              returnKeyType={"return"}
              autoCorrect={false}
              multiline={true}
              // onSubmitEditing={this._addToDos}
              underlineColorAndroid={"transparent"}
              enablesReturnKeyAutomatically={true} //아무것도 작성하지않으면 완료 버튼 비활성
            />
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={this._addToDos}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      {/* <ScrollView contentContainerStyle={styles.toDos}> */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.toDos}
        extraScrollHeight={150}
        >
          {Object.values(toDos).sort( (a,b) =>
            a.createdAt - b.createdAt
          ).map(toDo =>
            (
              <ToDo
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
      <View style={styles.footer}>
        <Text style={styles.footer_text}>
            Copyright 2020. Lotts. All rights reserved.
        </Text>
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
      const parsedToDos = JSON.parse(toDos);
      //console.log('data',parsedToDos);
      setTimeout( () => this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {}
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
            createdAt: Date.now(),
            modifyAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        // console.log("new ToDos:",newState.toDos);
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
            isCompleted: false,
            modifyAt: Date.now()
          }
        }
      };
      this._saveToDos(newState.toDos);
      // console.log("_uncompleteToDo :",newState.toDos);
      return {...newState};
    });
  };
  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true,
            modifyAt: Date.now()
          }
        }
      };
      this._saveToDos(newState.toDos);
      // console.log("_completeToDo :",newState.toDos);
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
  _saveToDos = newToDos  => {
    //console.log('save1 ',newToDos);
    const revertedToDos = JSON.stringify(newToDos);
    //console.log('save2 ',revertedToDos);
    const saveToDos = AsyncStorage.setItem("toDos",revertedToDos);
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
    flex: 13,
    width: width - 25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
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
    padding: 10,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    width: width - 50,
    fontWeight: "600",
    fontSize: 20

  },
  toDos: {
    alignItems: "center"
  },
  footer: {
    flex: 1
  },
  footer_text: {
    marginTop: 24,
    color: "#f1f3f4",
    fontSize: 11
  },
  inputBox: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2,
    marginVertical: 10
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer:{
    marginVertical: 10,
    marginHorizontal: 10
  }
});
