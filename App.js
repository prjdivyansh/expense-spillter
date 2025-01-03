// App.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

export default function App() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');

  const addParticipant = () => {
    if (newParticipant.trim() === '') {
      Alert.alert('Error', 'Participant name cannot be empty.');
      return;
    }
    setParticipants([...participants, newParticipant]);
    setNewParticipant('');
  };

  const deleteParticipant = (name) => {
    setParticipants(participants.filter((participant) => participant !== name));
    setExpenses(expenses.filter((expense) => expense.name !== name));
  };

  const addExpense = () => {
    if (amount.trim() === '' || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }
    if (participants.length === 0) {
      Alert.alert('Error', 'Add participants before adding expenses.');
      return;
    }
    if (payer.trim() === '' || !participants.includes(payer)) {
      Alert.alert('Error', 'Please select a valid payer from the participants.');
      return;
    }
    const totalAmount = parseFloat(amount);
    const splitAmount = totalAmount / participants.length;
    const updatedExpenses = participants.map((participant) => {
      const existingExpense = expenses.find((expense) => expense.name === participant);
      const owedAmount = participant === payer ? 0 : splitAmount;
      const paidAmount = participant === payer ? totalAmount : 0;
      return {
        name: participant,
        paid: (existingExpense?.paid || 0) + paidAmount,
        owes: (existingExpense?.owes || 0) + owedAmount,
      };
    });
    setExpenses(updatedExpenses);
    setAmount('');
    setPayer('');
  };

  const clearExpenses = () => {
    setExpenses([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Useful Expense Splitter</Text>

      /* Add Participant Section */
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter participant name"
          value={newParticipant}
          onChangeText={setNewParticipant}
        />
        <TouchableOpacity style={styles.button} onPress={addParticipant}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      /* Participants List */
      <FlatList
        data={participants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteParticipant(item)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      /* Add Expense Section */
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter total expense"
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Who paid?"
          value={payer}
          onChangeText={setPayer}
        />
        <TouchableOpacity style={styles.button} onPress={addExpense}>
          <Text style={styles.buttonText}>Split</Text>
        </TouchableOpacity>
      </View>

      /* Expenses List */
      <FlatList
        data={expenses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>
              {item.name} paid ₹{item.paid.toFixed(2)} and owes ₹{item.owes.toFixed(2)}.
            </Text>
          </View>
        )}
      />

      /* Clear Expenses Button */
      <TouchableOpacity style={styles.clearButton} onPress={clearExpenses}>
        <Text style={styles.clearButtonText}>Clear Expenses</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  listText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 5,
    borderRadius: 5,
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
