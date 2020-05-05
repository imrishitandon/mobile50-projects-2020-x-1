import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Vibration } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      workMinutes: 25,
      workSeconds: 0,
      breakMinutes: 5,
      breakSeconds: 0,
      minutes: 0,
      seconds: 19,
      workFlag: true,
      runningFlag: true,
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.minutes <= 0 && nextState.seconds <=0) {
      Vibration.vibrate(30)
      this.setState(state => ({
        minutes: state.workFlag ? state.breakMinutes : state.workMinutes,
        seconds: state.workFlag ? state.breakSeconds : state.workSeconds,
        workFlag: !state.workFlag
      }))
    }
    return true;
  }

  componentDidMount() {
    this.toggle(this.state.runningFlag)
  }

  toggle = (bool) => {
    if (bool) {
      this.interval = setInterval(this.inc, 1000)
    }
    else {
      clearInterval(this.interval)
    }
  }

  componentWillUnmount() {
    this.toggle(false)
  }

  mainOperation = () => {
    console.log("workFlag: "+this.state.workFlag+", workMinutes: "+this.state.workMinutes+", workSeconds: "+this.state.workSeconds)
    this.setState(prevState => ({
        minutes: prevState.workFlag ? prevState.workMinutes : prevState.breakMinutes ,
        seconds: prevState.workFlag ? prevState.workSeconds : prevState.breakSeconds ,
      runningFlag: !prevState.runningFlag,
    }))
    this.toggle(!this.state.runningFlag)
  }
  
  inc = () => {
    this.setState(prevState => ({
      minutes: prevState.seconds <= 0 ? prevState.minutes - 1 : prevState.minutes ,
      seconds: prevState.seconds <= 0 ? 60 : prevState.seconds - 1 ,
    }))
    return
  }

    addLeadingZero = (val) => {
      return (val < 10 ? (val === 0 ? '00' : '0' + val) : val)
    }

  reset = () => {
    this.toggle(false)
    this.setState(prevState => ({
      minutes: prevState.workMinutes,
      seconds: prevState.workSeconds,
      workFlag: true,
      runningFlag: false
    }))
  }

  validateInput(num, fieldname) {
      console.log("number is "+num+", fieldname is "+fieldname)
      if (num <=60) {
        this.setState({ [fieldname]: num });
      } else {
        console.log("Time is bigger than 60")
      }
      return false;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>{this.state.workFlag ? 'Work Timer' : 'Break Timer'}</Text>
        <Text style={styles.mainText}>{this.addLeadingZero(this.state.minutes)+" : "+this.addLeadingZero(this.state.seconds)}</Text>
        <View style={styles.sameRow}>
          <Button title={this.state.runningFlag ? 'Stop' : 'Start'} onPress={this.mainOperation} />
          <Button title='Reset' onPress={this.reset} />
        </View>
        <View style={styles.sameRow}>
          <Text style={styles.normalText}>Work Time:</Text>
          <TextInput onChangeText={ (num) => { this.validateInput(num, 'workMinutes')}} 
                keyboardType="numeric"
                maxLength={2} 
                placeholder="Minutes"
                style={{borderColor: 'gray', borderWidth: 1}}/>
          <TextInput onChangeText={(text) => this.setState({ workSeconds: text })} 
                keyboardType="numeric" 
                maxLength={2} 
                placeholder="Seconds"
                style={{borderColor: 'gray', borderWidth: 1}}/>
        </View>
        <View style={styles.sameRow}>
          <Text style={styles.normalText}>Break Time:</Text>
          <TextInput onChangeText={ (num) => { this.validateInput(num, 'breakMinutes')}} 
                keyboardType="numeric"
                maxLength={2} 
                placeholder="Minutes"
                style={{borderColor: 'gray', borderWidth: 1}}/>
          <TextInput onChangeText={(text) => this.setState({ breakSeconds: text })} 
                keyboardType="numeric" 
                maxLength={2} 
                placeholder="Seconds"
                style={{borderColor: 'gray', borderWidth: 1}}/>
        </View>
        <View style={styles.instruction}>
          <Text>{'\n\n'} </Text>
          <Text>Instructions: </Text>
          <Text>1. Default Work Time is 25 Minutes and Break Time is 5 minutes</Text>
          <Text>2. As you change the Work and Break Time, it will automatically take effect in next cycle</Text>
          <Text>3. Work and Break Time can be of maximum 60 minutes </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 40
  },
  normalText: {
    fontSize: 20
  },
  instruction: {
    fontSize: 15,
    borderColor: '#FFFFFF',
  },
  sameRow: {
    flexDirection: 'row'
  }
});