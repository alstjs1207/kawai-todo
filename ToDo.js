import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ReactNative,
  Alert
} from 'react-native';

import PropTypes from 'prop-types';

const {height, width} = Dimensions.get("window");

export default class ToDo extends React.Component {
  constructor(props){
    super(props);
    this.state = {isEditing: false, toDoValue: props.text};
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    uncompleteToDo: PropTypes.func.isRequired,
    completeToDo: PropTypes.func.isRequired,
    updateToDo: PropTypes.func.isRequired,
  }

  render() {
    const {isEditing, toDoValue} = this.state;
    const {text, id, deleteToDo, isCompleted, scrollToInput} = this.props;
    return (<View style={styles.container}>
      <View style={styles.column}>
        <TouchableOpacity onPress={this._toggleComplete}>
          <View style={[
              styles.circle, isCompleted
                ? styles.completedCircle
                : styles.uncompletedCircle
            ]}></View>
        </TouchableOpacity>
        {
          isEditing
            ? (<TextInput style={[styles.text,styles.input,
              isCompleted
                  ? styles.completedText
                  : styles.uncompletedText
              ]} value={toDoValue}
                 multiline={true}
                 onChangeText={this._contorlInput}
                 returnKeyType={"return"}
                 onBlur={this._finishEditing}
                 autoFocus={true}
                 underlineColorAndroid={"transparent"}
                 enablesReturnKeyAutomatically={true}
               />)
            : (<Text style={[styles.text,
              isCompleted
                ? styles.completedText
                : styles.uncompletedText]}>
              {text}
            </Text>)
        }
      </View>
      {
        isEditing
          ? (<View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>👌</Text>
              </View>
            </TouchableOpacity>
          </View>)
          : isCompleted
          ? (<View style={styles.actions}>
              <TouchableOpacity onPressOut={(event) => {event.stopPropagation; deleteToDo(id)}}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>❌</Text>
                </View>
              </TouchableOpacity>
          </View>)
          : (<View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✍</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPressOut={this._alertCancel}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>)
      }
    </View>);
  }
  _toggleComplete = event => {
    event.stopPropagation();
    // this.setState(prevState => {
    //   return {
    //     isCompleted: !prevState.isCompleted
    //   };
    // });
    const {isCompleted, uncompleteToDo, completeToDo, id} = this.props;
    if(isCompleted){
      uncompleteToDo(id);
    } else {
      completeToDo(id);
    }
  };

  _startEditing = event => {
    event.stopPropagation();
    //const {text} = this.props;
    this.setState({
      isEditing: true
      //, toDoValue: text
    });
  };

  _finishEditing = event => {
    event.stopPropagation();
    const {toDoValue} = this.state;
    const {id, updateToDo} = this.props;
    updateToDo(id,toDoValue);
    this.setState({isEditing: false});
  };

  _contorlInput = (text) => {
    this.setState({toDoValue: text})
  };

  _alertCancel = event => {
    event.stopPropagation();
      const {deleteToDo, id} = this.props;
    Alert.alert(
      'Alert',
      '오늘의 일정을 삭제하시겠습니까?',
      [
        {text:'예', onPress: () => deleteToDo(id) },
        {text:'아니오',onPress: () => '', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 10
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20
  },
  completedCircle: {
    borderColor: "#1eb2a6"
  },
  uncompletedCircle: {
    borderColor: "#F23657"
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353535"
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
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  actionText: {},
  input: {
    marginVertical: 6,
    width: width / 2
  }
});
