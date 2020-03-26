## Daily To Do App
Daily To Do App made with React Native

React Native - AsyncStorage, Platform, Dimensions, TouchableOpacity

expo - AppLoading

npm install uuid (X) error 발생

npm install react-native-uuid (O)

# 스크롤바 변경

scrollview -> KeyboardAwareScrollView

npm install react-native-keyboard-aware-scroll-view --save


# 배포

expo build:android


# 순서 정렬 버그 수정

completeToDos / uncompleteToDos 시 순서가 변경되고
updateToDos에도 순서가 변경되는 버그

sort를 이용한 순서 버그 수정

# footer 추가

Copyright 작성

# 삭제시 Alert 추가

import { Alert } from 'react-native';

# todo 입력창 한번에 하기 쉽도록 수정
