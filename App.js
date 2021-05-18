import React, {useEffect, useState, useRef} from 'react';
import { TextInput, StyleSheet, Text, View, SafeAreaView, Vibration, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Constants from 'expo-constants';

const STATUSBAR_HEIGHT = Constants.statusBarHeight;
const MINUTES_STRING = 'Minutes...';
const SECONDS_STRING = 'Seconds...';

const App = props => {
  const [workBreak, setWorkBreak] = useState('work');
  const [start, setStart] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [workBreakText, setText] = useState('');
  const [currentTime, setCurrentTime] = useState((workMinutes * 60) + workSeconds);
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [hasBeenStarted, setHasBeenStarted] = useState(false);

  const resetTimer = () => {
    setWorkBreak('work');
    setWorkMinutes(workMinutes);
    setWorkSeconds(workSeconds);
    setBreakMinutes(breakMinutes);
    setBreakSeconds(breakSeconds);
    setStart(false);
    setCurrentTime((workMinutes * 60) + workSeconds);
    setText('');
    setCurrentMinutes((Math.floor(currentTime/60) < 10) ? ('0' + Math.floor(currentTime/60)) : (Math.floor(currentTime/60)));
    setCurrentSeconds((currentTime%60 < 10) ? ('0' + currentTime%60) : (currentTime%60));
    setHasBeenStarted(false);
  }

  useEffect(() => {
    let intervalID = setInterval(() => {
      if(currentTime !== 0 && start) {
        setCurrentTime(currentTime - 1);     
      }
      else if(currentTime === 0 && start) {
        
        if(workBreak === 'work') {
          setCurrentTime((breakMinutes * 60) + breakSeconds);
          setWorkBreak('break');
        }
        else {
          setCurrentTime((workMinutes * 60) + workSeconds);
          setWorkBreak('work');
        }
      }
      if(currentTime == 1 && start) {
        Vibration.vibrate();
      }
    }, 1000)
    return () => {
      clearInterval(intervalID)
    }
  })

  useEffect(() => {
    if(workBreak === 'work') {
      setText('Work');
    }
    else if(workBreak === 'break') {
      setText('Break');
    }
  })

  useEffect(() => {
    if(!start && !hasBeenStarted) {
      setCurrentTime((workMinutes * 60) + workSeconds);
      setCurrentMinutes((Math.floor(currentTime/60) < 10) ? ('0' + Math.floor(currentTime/60)) : (Math.floor(currentTime/60)));
      setCurrentSeconds((currentTime%60 < 10) ? ('0' + currentTime%60) : (currentTime%60));
    }
    else {
      setCurrentMinutes((Math.floor(currentTime/60) < 10) ? ('0' + Math.floor(currentTime/60)) : (Math.floor(currentTime/60)));
      setCurrentSeconds((currentTime%60 < 10) ? ('0' + currentTime%60) : (currentTime%60));
    }
  })

  return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback style={{flex: 1}} onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.title}>
              <Text style={styles.textTitle}>Pomodoro Timer</Text>
            </View>
            <View style={styles.title}>
              <Text style={styles.textTitle}>{workBreakText}</Text>
            </View>
            <View style={styles.title}>
              <Text style={styles.textTitle}>{currentMinutes + ':' + currentSeconds}</Text>
            </View>
            <View style={styles.buttonMainView}>
              <View style={styles.buttonsSpacing}></View>
              <TouchableOpacity style={styles.buttons}  onPress={() => {setStart(!start); setHasBeenStarted(true)}}>
                <Text style={styles.buttonsText}>{!start ? 'START' : 'STOP'}</Text>
              </TouchableOpacity>
              <View style={styles.buttonsSpacing}></View>
              <TouchableOpacity style={styles.buttons} onPress={resetTimer}>
                <Text style={styles.buttonsText}>RESET</Text>
              </TouchableOpacity>
              <View style={styles.buttonsSpacing}></View>
            </View>
            <View style={styles.inputBoxTitleView}><Text style={styles.inputBoxesTitles}>Work Time</Text></View>
            <View style={styles.inputBoxesMainView}>
              <TextInput style={styles.inputBox} placeholder={MINUTES_STRING} placeholderTextColor='white' onChangeText={(text) => setWorkMinutes(+text)} keyboardType='numeric'></TextInput>
              <TextInput style={styles.inputBox} placeholder={SECONDS_STRING} placeholderTextColor='white' onChangeText={(text) => setWorkSeconds(+text)} keyboardType='numeric'></TextInput>
            </View>
            <View style={styles.inputBoxTitleView}><Text style={styles.inputBoxesTitles}>Break Time</Text></View>
            <View style={styles.inputBoxesMainView}>
              <TextInput style={styles.inputBox} placeholder={MINUTES_STRING} placeholderTextColor='white' onChangeText={(text) => setBreakMinutes(+text)} keyboardType='numeric'></TextInput>
              <TextInput style={styles.inputBox} placeholder={SECONDS_STRING} placeholderTextColor='white' onChangeText={(text) => setBreakSeconds(+text)} keyboardType='numeric'></TextInput>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#341f97',
    paddingTop: STATUSBAR_HEIGHT,
  },  
  title: {
    flex: 3,
    backgroundColor: '#341f97',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle:{
    fontWeight: 'bold',
    fontSize: 48,
    color: 'white',
    textAlign: 'center',
  },
  buttonMainView: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#341f97',
    },
  buttons: {
    flex: 12,
    backgroundColor: '#7d5fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '45%',
    borderRadius: 15,
  },
  buttonsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonsSpacing: {
    flex: 1,
  },
  inputBoxesMainView:{
    flex: 2,
    backgroundColor: '#341f97',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    alignContent:'space-around',
  },
  inputBox: {
    borderWidth: 2,
    borderColor: '#341f97',
    height: 50,
    width: '45%',
    paddingLeft: 10,
    backgroundColor: '#7d5fff',
    color: 'white',
    borderRadius: 15,
  },
  inputBoxTitleView: {
    flex: 2,
    backgroundColor: '#341f97',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBoxesTitles: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white'
  },
});

export default App;


    {/* -----THESE ARE BUTTONS THAT I OPTED OUT OF USING IN FAVOR OF USING TOUCHABLE OPACITY INSTEAD----- */}

    {/* <View style={styles.buttonView}>
      <Button  color='#7d5fff' title={buttonText} onPress={() => {setStart(!start); setHasBeenStarted(true)}}></Button>
    </View> */}
    {/* <View style={styles.buttonView}>
      <Button color='#7d5fff' title='Reset' onPress={resetTimer}></Button>
    </View> */}
          
  //---BUTTONS SWITCHED OUT TO TOUCHABLE OPACITY---
  // buttonView: {
  //   flex: 2,
  //   paddingHorizontal: '5%',
  //   justifyContent: 'space-around',
  // },

  
  // useInterval(() => {
  //   if(currentTime !== 0 && start) {
  //     setCurrentTime(currentTime - 1);      
  //   }
  //   else if(currentTime === 0 && start) {
  //     Vibration.vibrate();
  //     if(workBreak === 'work') {
  //       setCurrentTime((breakMinutes * 60) + breakSeconds);
  //       setWorkBreak('break');
  //     }
  //     else {
  //       setCurrentTime((workMinutes * 60) + workSeconds);
  //       setWorkBreak('work');
  //     }
  //   }
  // }, 1000)

// function useInterval(callback, delay) {
//   const savedCallback = useRef();

//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);

//   // Set up the interval.
//   useEffect(() => {
//     function tick() {
//       savedCallback.current();
//     }
//     if (delay !== null) {
//       let id = setInterval(tick, delay);
//       return () => clearInterval(id);
//     }
//   }, [delay]);
// }