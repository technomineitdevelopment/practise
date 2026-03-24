import { useMemo, useState } from 'react';

const initialAssets = [
  { id: 1, name: 'Dell Latitude 7440', category: 'Laptop', owner: 'Alice', status: 'Allocated', purchaseDate: '2024-05-20' },
  { id: 2, name: 'iPhone 14', category: 'Mobile', owner: 'Bob', status: 'In Repair', purchaseDate: '2023-12-08' },
  { id: 3, name: 'HP LaserJet M209', category: 'Printer', owner: 'IT Pool', status: 'Available', purchaseDate: '2022-09-14' },
  { id: 4, name: 'Lenovo ThinkPad P1', category: 'Laptop', owner: 'Carol', status: 'Allocated', purchaseDate: '2024-01-15' }
];

export default function App() {
  const [assets, setAssets] = useState(initialAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Laptop',
    owner: '',
    status: 'Available',
    purchaseDate: ''
  });

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, searchTerm, statusFilter]);

  const summary = useMemo(() => {
    const total = assets.length;
    const allocated = assets.filter((a) => a.status === 'Allocated').length;
    const available = assets.filter((a) => a.status === 'Available').length;
    const inRepair = assets.filter((a) => a.status === 'In Repair').length;
    return { total, allocated, available, inRepair };
  }, [assets]);

  function addAsset(e) {
    e.preventDefault();
    if (!newAsset.name || !newAsset.owner || !newAsset.purchaseDate) {
      return;
    }

    setAssets((prev) => [
      ...prev,
      {
        ...newAsset,
        id: prev.length ? Math.max(...prev.map((a) => a.id)) + 1 : 1
      }
    ]);

    setNewAsset({
      name: '',
      category: 'Laptop',
      owner: '',
      status: 'Available',
      purchaseDate: ''
    });
  }

  return (
    <div className="container">
      <header>
        <h1>Asset Management Dashboard</h1>
        <p>React sample project to track and manage company assets.</p>
      </header>

      <section className="summary-grid">
        <SummaryCard label="Total Assets" value={summary.total} />
        <SummaryCard label="Allocated" value={summary.allocated} />
        <SummaryCard label="Available" value={summary.available} />
        <SummaryCard label="In Repair" value={summary.inRepair} />
      </section>

      <section className="filters">
        <input
          type="text"
          placeholder="Search by asset or owner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Allocated</option>
          <option>Available</option>
          <option>In Repair</option>
        </select>
      </section>

      <section className="panel">
        <h2>Add New Asset</h2>
        <form className="asset-form" onSubmit={addAsset}>
          <input
            type="text"
            placeholder="Asset Name"
            value={newAsset.name}
            onChange={(e) => setNewAsset((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Owner"
            value={newAsset.owner}
            onChange={(e) => setNewAsset((prev) => ({ ...prev, owner: e.target.value }))}
          />
          <select
            value={newAsset.category}
            onChange={(e) => setNewAsset((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option>Laptop</option>
            <option>Mobile</option>
            <option>Printer</option>
            <option>Accessory</option>
          </select>
          <select
            value={newAsset.status}
            onChange={(e) => setNewAsset((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option>Available</option>
            <option>Allocated</option>
            <option>In Repair</option>
          </select>
          <input
            type="date"
            value={newAsset.purchaseDate}
            onChange={(e) => setNewAsset((prev) => ({ ...prev, purchaseDate: e.target.value }))}
          />
          <button type="submit">Add Asset</button>
        </form>
      </section>

      <section className="panel">
        <h2>Asset List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.name}</td>
                <td>{asset.category}</td>
                <td>{asset.owner}</td>
                <td>
                  <span className={`badge ${asset.status.replace(' ', '-').toLowerCase()}`}>
                    {asset.status}
                  </span>
                </td>
                <td>{asset.purchaseDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="summary-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
