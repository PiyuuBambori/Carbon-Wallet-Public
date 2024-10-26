import React from 'react';
import { Wallet, Sprout, CreditCard, PieChart, History, Plus, LogOut } from 'lucide-react';
import TransactionForm from './components/TransactionForm';
import CarbonMetrics from './components/CarbonMetrics';
import TransactionList from './components/TransactionList';
import CarbonTips from './components/CarbonTips';
import LoginPage from './components/LoginPage';
import { Transaction } from './types';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [showForm, setShowForm] = React.useState(false);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
    setShowForm(false);
  };

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCarbon = transactions.reduce((sum, t) => sum + calculateCarbon(t), 0);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Carbon Wallet</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CarbonMetrics totalSpent={totalSpent} totalCarbon={totalCarbon} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} />
          </div>
          <div className="lg:col-span-1">
            <CarbonTips transactions={transactions} />
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <TransactionForm onSubmit={addTransaction} onClose={() => setShowForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate carbon footprint based on category and amount
function calculateCarbon(transaction: Transaction): number {
  const factors: Record<string, number> = {
    food: 0.2,
    transport: 0.4,
    shopping: 0.3,
    utilities: 0.5,
    entertainment: 0.1,
  };
  return transaction.amount * (factors[transaction.category] || 0.2);
}

export default App;