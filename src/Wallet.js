import React, { useState } from 'react';

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [transaction, setTransaction] = useState({ amount: '', description: '', date: '' });

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTransaction = () => {
    const newTransaction = {
      ...transaction,
      amount: parseFloat(transaction.amount),
      date: new Date(transaction.date).toLocaleDateString(),
    };
    setTransactions([...transactions, newTransaction]);
    setBalance(balance + newTransaction.amount);
    setTransaction({ amount: '', description: '', date: '' });
  };

  const handleDeleteTransaction = (index) => {
    const newTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(newTransactions);
    const updatedBalance = newTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    setBalance(updatedBalance);
  };

  return (
    <div className="wallet">
      <h2>Portfel</h2>
      <div className="balance">
        <h3>Saldo: {balance} PLN</h3>
      </div>
      <form className="transaction-form">
        <div className="form-group">
          <label>Kwota:</label>
          <input
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={handleTransactionChange}
            placeholder="Wpisz kwotę"
          />
        </div>
        <div className="form-group">
          <label>Opis:</label>
          <input
            type="text"
            name="description"
            value={transaction.description}
            onChange={handleTransactionChange}
            placeholder="Wpisz opis transakcji"
          />
        </div>
        <div className="form-group">
          <label>Data:</label>
          <input
            type="date"
            name="date"
            value={transaction.date}
            onChange={handleTransactionChange}
          />
        </div>
        <button type="button" onClick={handleAddTransaction}>Dodaj transakcję</button>
      </form>
      <div className="transaction-list">
        <h3>Historia transakcji:</h3>
        <ul>
          {transactions.map((trans, index) => (
            <li key={index}>
              {trans.date} - {trans.description}: {trans.amount} PLN
              <button onClick={() => handleDeleteTransaction(index)}>Usuń</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Wallet;
