import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [containers, setContainers] = useState([
    { id: '701', tenant: null, location: '', material: '', rental_amount: '' },
    { id: '702', tenant: null, location: '', material: '', rental_amount: '' },
    { id: '1001', tenant: null, location: '', material: '', rental_amount: '' },
    { id: '1002', tenant: null, location: '', material: '', rental_amount: '' },
    { id: '1501', tenant: null, location: '', material: '', rental_amount: '' },
    { id: '1502', tenant: null, location: '', material: '', rental_amount: '' },
  ]);

  const [selectedContainer, setSelectedContainer] = useState(null);
  const [newTenant, setNewTenant] = useState({
    name: '',
    address: '',
    phone: '',
    rental_amount: '',
    payment_type: 'przy podstawieniu',
    invoice: 'nie',
    payment_status: 'nie zaplacone',
  });

  const [containerInfo, setContainerInfo] = useState({
    location: '',
    material: '',
    rental_amount: '',
  });

  const [showInfoModal, setShowInfoModal] = useState(false);

  const [walletTransactions, setWalletTransactions] = useState([]); // Nowy stan do przechowywania transakcji
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');

  const selectContainer = (containerId) => {
    const container = containers.find(c => c.id === containerId);
    setSelectedContainer(containerId);  // Zmieniamy tylko aktywny kontener
  
    if (container && container.tenant) {
      setNewTenant(container.tenant);
      setContainerInfo({
        location: container.location,
        material: container.material,
        rental_amount: container.rental_amount,
      });
    } else {
      // Zresetuj dane, jeśli kontener nie ma najemcy
      setNewTenant({
        name: '',
        address: '',
        phone: '',
        rental_amount: '',
        payment_type: 'przy podstawieniu',
        invoice: 'nie',
        payment_status: 'nie zaplacone',
      });
      setContainerInfo({ location: '', material: '', rental_amount: '' });
    }
  };

  const handleTenantChange = (e) => {
    const { name, value } = e.target;
    setNewTenant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContainerInfoChange = (e) => {
    const { name, value } = e.target;
    setContainerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedContainers = containers.map((container) =>
      container.id === selectedContainer
        ? { ...container, tenant: { ...newTenant }, ...containerInfo }
        : container
    );
    setContainers(updatedContainers);
    setSelectedContainer(null);
    setNewTenant({
      name: '',
      address: '',
      phone: '',
      rental_amount: '',
      payment_type: 'przy podstawieniu',
      invoice: 'nie',
      payment_status: 'nie zaplacone',
    });
    setContainerInfo({ location: '', material: '', rental_amount: '' });
  };

  const handleDeleteTenant = (containerId) => {
    // Usuwamy najemcę tylko z wybranego kontenera
    const updatedContainers = containers.map((container) =>
      container.id === containerId ? { ...container, tenant: null } : container
    );
    setContainers(updatedContainers);  // Zaktualizowane kontenery
    setSelectedContainer(null);  // Resetujemy zaznaczenie kontenera
  };
  

  const handleShowInfo = (containerId) => {
    const container = containers.find(c => c.id === containerId);
    if (container) {
      setContainerInfo({
        location: container.location,
        material: container.material,
        rental_amount: container.rental_amount,
      });
      setShowInfoModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
  };

  const handleSaveInfo = () => {
    const updatedContainers = containers.map((container) =>
      container.id === selectedContainer
        ? { ...container, location: containerInfo.location, material: containerInfo.material, rental_amount: containerInfo.rental_amount }
        : container
    );
    setContainers(updatedContainers);
    setShowInfoModal(false);
  };

  const handleAddTransaction = () => {
    if (transactionDescription && transactionAmount) {
      const currentDateTime = new Date();
      const formattedDateTime = currentDateTime.toISOString().slice(0, 19).replace('T', ' '); // Format YYYY-MM-DD HH:MM:SS
      const newTransaction = {
        description: transactionDescription,
        amount: parseFloat(transactionAmount),
        date: formattedDateTime,
      };
      setWalletTransactions([...walletTransactions, newTransaction]);
      setTransactionDescription('');
      setTransactionAmount('');
    }
  };

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = walletTransactions.filter((_, i) => i !== index);
    setWalletTransactions(updatedTransactions);
  };

  const calculateBalance = () => {
    return walletTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  return (
    <div className="app">
      <h1 className="title">FERPOL - Panel Admina</h1>
      <div className="container-list">
        {containers.map((container) => (
          <div
            key={container.id}
            className={`container-item ${selectedContainer === container.id ? 'selected' : ''} ${container.tenant ? 'red-border' : 'green-border'}`}
            onClick={() => selectContainer(container.id)}
          >
            <h2>Kontener {container.id}</h2>
            {container.tenant ? (
              <div className="tenant-info">
                <p><strong>Imię i nazwisko:</strong> {container.tenant.name}</p>
                <p><strong>Adres:</strong> {container.tenant.address}</p>
                <p><strong>Telefon:</strong> {container.tenant.phone}</p>
                <p><strong>Kwota wynajmu:</strong> {container.tenant.rental_amount} PLN</p>
                <p><strong>Rodzaj platnosci:</strong> {container.tenant.payment_type === 'przy podstawieniu' ? 'Przy podstawieniu' : 'Przy odbiorze'}</p>
                <p><strong>Faktura:</strong> {container.tenant.invoice === 'tak' ? 'Tak' : 'Nie'}</p>
                <p><strong>Status płatności:</strong> {container.tenant.payment_status}</p>
                <div className="buttons-container">
                  <button className="edit-button">Edytuj</button>
                  <button
  className="delete-button"
  onClick={(e) => {
    e.stopPropagation();  // Zapobiegamy propagacji kliknięcia
    handleDeleteTenant(container.id);  // Przekazujemy id kontenera do usunięcia
  }}
>
  Usuń osobę
</button>
                </div>
              </div>
            ) : (
              <div className="buttons-container">
                <button className="add-button">Dodaj osobę</button>
              </div>
            )}
            <div className="buttons-container">
              <button
                className="info-button"
                onClick={() => handleShowInfo(container.id)}
              >
                Info
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedContainer && (
        <div className="form-container">
          <h3>{containers.find(c => c.id === selectedContainer).tenant ? 'Edytuj osobę' : `Dodaj osobę do kontenera ${selectedContainer}`}</h3>
          <form>
            <div className="form-group">
              <label>Imię i Nazwisko:</label>
              <input
                type="text"
                name="name"
                value={newTenant.name}
                onChange={handleTenantChange}
                placeholder="Wpisz imię i nazwisko"
              />
            </div>
            <div className="form-group">
              <label>Adres:</label>
              <input
                type="text"
                name="address"
                value={newTenant.address}
                onChange={handleTenantChange}
                placeholder="Wpisz adres"
              />
            </div>
            <div className="form-group">
              <label>Numer telefonu:</label>
              <input
                type="text"
                name="phone"
                value={newTenant.phone}
                onChange={handleTenantChange}
                placeholder="Wpisz numer telefonu"
              />
            </div>
            <div className="form-group">
              <label>Kwota wynajmu:</label>
              <input
                type="number"
                name="rental_amount"
                value={newTenant.rental_amount}
                onChange={handleTenantChange}
                placeholder="Wpisz kwotę wynajmu"
              />
            </div>
            <div className="form-group">
              <label>Rodzaj płatności:</label>
              <select
                name="payment_type"
                value={newTenant.payment_type}
                onChange={handleTenantChange}
              >
                <option value="przy podstawieniu">Przy podstawieniu</option>
                <option value="przy odbiorze">Przy odbiorze</option>
              </select>
            </div>
            <div className="form-group">
              <label>Faktura:</label>
              <select
                name="invoice"
                value={newTenant.invoice}
                onChange={handleTenantChange}
              >
                <option value="tak">Tak</option>
                <option value="nie">Nie</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status płatności:</label>
              <select
                name="payment_status"
                value={newTenant.payment_status}
                onChange={handleTenantChange}
              >
                <option value="zaplacone">Zaplacone</option>
                <option value="nie zaplacone">Nie zaplacone</option>
              </select>
            </div>
            <button type="button" className="save-button" onClick={handleSave}>
              Zapisz
            </button>
          </form>
        </div>
      )}

      {showInfoModal && (
        <div className="info-modal">
          <div className="info-modal-content">
            <h3>Informacje o kontenerze</h3>
            <form>
              <div className="form-group">
                <label>Lokalizacja:</label>
                <input
                  type="text"
                  name="location"
                  value={containerInfo.location}
                  onChange={handleContainerInfoChange}
                  placeholder="Wpisz lokalizację"
                />
              </div>
              <div className="form-group">
                <label>Materiał:</label>
                <input
                  type="text"
                  name="material"
                  value={containerInfo.material}
                  onChange={handleContainerInfoChange}
                  placeholder="Wpisz materiał"
                />
              </div>
              <div className="form-group">
                <label>Kwota wynajmu:</label>
                <input
                  type="number"
                  name="rental_amount"
                  value={containerInfo.rental_amount}
                  onChange={handleContainerInfoChange}
                  placeholder="Wpisz kwotę wynajmu"
                />
              </div>
            </form>
            <div className="buttons-container">
              <button className="save-button" onClick={handleSaveInfo}>
                Zapisz
              </button>
              <button className="close-button" onClick={handleCloseModal}>
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sekcja Portfel */}
      <div className="wallet-section">
        <h3>Portfel 💲</h3>
        <div className="form-group">
          <label>Opis transakcji:</label>
          <input
            type="text"
            value={transactionDescription}
            onChange={(e) => setTransactionDescription(e.target.value)}
            placeholder="Wpisz opis transakcji"
          />
        </div>
        <div className="form-group">
          <label>Kwota transakcji:</label>
          <input
            type="number"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            placeholder="Wpisz kwotę"
          />
        </div>
        <button onClick={handleAddTransaction} className="add-transaction-button">
          Dodaj transakcję
        </button>

        <h4>Saldo: {calculateBalance()} PLN</h4>

        <div className="transactions-list">
          {walletTransactions.map((transaction, index) => (
            <div key={index} className="transaction-item">
              <p>{transaction.date} - {transaction.description}: {transaction.amount} PLN</p>
              <button
                onClick={() => handleDeleteTransaction(index)}
                className="delete-transaction-button"
              >
                Usuń
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
