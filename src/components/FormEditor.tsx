import React, { useState } from 'react';
import { HandoverFormData, AssetItem } from '../types';
import {
  LOCATION_OPTIONS,
  HANDOVER_BY_OPTIONS,
  PROJECT_OPTIONS,
} from '../utils/presets';
import {
  Building2,
  UserCheck,
  Package,
  FileSignature,
  Plus,
  Trash2,
  Copy,
  Calendar,
} from 'lucide-react';

interface FormEditorProps {
  data: HandoverFormData;
  onChange: (data: HandoverFormData) => void;
  onOpenSignatureModal: (field: 'plTl' | 'itDept' | 'employee') => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({
  data,
  onChange,
  onOpenSignatureModal,
}) => {
  const [activeTab, setActiveTab] = useState<'company' | 'personnel' | 'items' | 'legal'>('company');

  // Update root level fields
  const updateField = <K extends keyof HandoverFormData>(field: K, value: HandoverFormData[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // Add Item
  const handleAddItem = (preset?: Partial<AssetItem>) => {
    const nextNr = (data.items.length + 1).toString();
    const newItem: AssetItem = {
      id: Date.now().toString(),
      nr: nextNr,
      description: preset?.description || '',
      assetTag: preset?.assetTag || `TAG-${Math.floor(10000 + Math.random() * 90000)}`,
      qty: preset?.qty ?? 1,
      price: preset?.price || '',
      remarks: preset?.remarks || 'Good condition',
    };
    onChange({
      ...data,
      items: [...data.items, newItem],
    });
  };

  // Update Item
  const handleUpdateItem = (id: string, field: keyof AssetItem, value: string | number) => {
    onChange({
      ...data,
      items: data.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  // Duplicate Item
  const handleDuplicateItem = (item: AssetItem) => {
    const newItem: AssetItem = {
      ...item,
      id: Date.now().toString(),
      nr: (data.items.length + 1).toString(),
      assetTag: `${item.assetTag}-COPY`,
    };
    onChange({
      ...data,
      items: [...data.items, newItem],
    });
  };

  // Set today's date
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onChange({
      ...data,
      handoverDate: today,
      employeeSignedDate: today,
    });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 text-neutral-200">
      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-800 bg-neutral-950/70 overflow-x-auto p-1.5 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'company'
              ? 'bg-neutral-800 text-sky-400 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Header & Org
        </button>

        <button
          onClick={() => setActiveTab('personnel')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'personnel'
              ? 'bg-neutral-800 text-sky-400 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Personnel
        </button>

        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'items'
              ? 'bg-neutral-800 text-sky-400 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Assets ({data.items.length})
        </button>

        <button
          onClick={() => setActiveTab('legal')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'legal'
              ? 'bg-neutral-800 text-sky-400 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
          }`}
        >
          <FileSignature className="w-3.5 h-3.5" />
          Signatures & Declaration
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: COMPANY & HEADER */}
        {activeTab === 'company' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Document Form Title
              </label>
              <input
                type="text"
                value={data.documentTitle}
                onChange={(e) => updateField('documentTitle', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Company / Entity Name
                </label>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Contact Information Header
                </label>
                <input
                  type="text"
                  value={data.contactHeaderTitle}
                  onChange={(e) => updateField('contactHeaderTitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Location (Office Branch)
                </label>
                <select
                  value={data.location}
                  onChange={(e) => {
                    const newLocation = e.target.value;
                    onChange({
                      ...data,
                      location: newLocation,
                      companyName: `KiKxxl&evroTarget - ${newLocation}`,
                    });
                  }}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  IT Support Contact Email
                </label>
                <input
                  type="email"
                  value={data.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Mobile (Viber, WhatsApp)
                </label>
                <input
                  type="text"
                  value={data.mobileContact}
                  onChange={(e) => updateField('mobileContact', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Office Phone Extension / Nr
                </label>
                <input
                  type="text"
                  value={data.officePhone}
                  onChange={(e) => updateField('officePhone', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Logo Settings */}
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold text-neutral-200 block">
                    eT KiKXXL COMMUNICATION Logo
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Official KiKxxl communication emblem
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={data.showLogo}
                    onChange={(e) => updateField('showLogo', e.target.checked)}
                    className="rounded border-neutral-700 text-sky-500 focus:ring-0"
                  />
                  <span>Show logo</span>
                </label>
              </div>

              {data.showLogo && (
                <div className="space-y-3 p-3 bg-neutral-800/40 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('logoStyle', 'blue-on-white')}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        data.logoStyle === 'blue-on-white'
                          ? 'bg-sky-600 text-white font-medium'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Blue on White (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('logoStyle', 'badge-card')}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        data.logoStyle === 'badge-card'
                          ? 'bg-sky-600 text-white font-medium'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Solid Blue Card
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer metadata */}
            <div className="pt-2 border-t border-neutral-800">
              <span className="text-xs font-semibold text-neutral-200 block mb-2">
                Document Footer & Classification
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Bottom Left Note</label>
                  <input
                    type="text"
                    value={data.footerLeft}
                    onChange={(e) => updateField('footerLeft', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Bottom Right Tag</label>
                  <input
                    type="text"
                    value={data.footerRight}
                    onChange={(e) => updateField('footerRight', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERSONNEL & ASSIGNMENT */}
        {activeTab === 'personnel' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Name of Employee
                </label>
                <input
                  type="text"
                  value={data.employeeName}
                  onChange={(e) => updateField('employeeName', e.target.value)}
                  placeholder="e.g. Arben Krasniqi"
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Assets HF Tagg (Handover Reference)
                </label>
                <input
                  type="text"
                  value={data.assetsHfTag}
                  onChange={(e) => updateField('assetsHfTag', e.target.value)}
                  placeholder="e.g. HF-PR-2026-08"
                  className="w-full px-3 py-2 text-sm font-mono bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Employee ID NR
                </label>
                <input
                  type="text"
                  value={data.employeeId}
                  onChange={(e) => updateField('employeeId', e.target.value)}
                  placeholder="e.g. EMP-84920"
                  className="w-full px-3 py-2 text-sm font-mono bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-300">Handover Date</label>
                  <button
                    type="button"
                    onClick={setToday}
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" /> Today
                  </button>
                </div>
                <input
                  type="date"
                  value={data.handoverDate}
                  onChange={(e) => updateField('handoverDate', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Project / Department
                </label>
                <select
                  value={data.projectDepartment}
                  onChange={(e) => updateField('projectDepartment', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {PROJECT_OPTIONS.map((proj) => (
                    <option key={proj} value={proj}>
                      {proj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Handover BY (IT Officer / Custodian)
                </label>
                <select
                  value={data.handoverBy}
                  onChange={(e) => {
                    const newPerson = e.target.value;
                    onChange({
                      ...data,
                      handoverBy: newPerson,
                      itDeptName: newPerson,
                      itDeptSignature: '', // reset signature for new person
                    });
                  }}
                  className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {HANDOVER_BY_OPTIONS.map((person) => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Introductory Statement (Above Table)
              </label>
              <textarea
                rows={2}
                value={data.introText}
                onChange={(e) => updateField('introText', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* TAB 3: ASSET INVENTORY */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-800">
              <div className="text-xs text-neutral-400">
                <span>{data.items.length} dynamic equipment entries</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem()}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Row
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-neutral-400 text-[11px] shrink-0">Quick add:</span>
              <button
                type="button"
                onClick={() =>
                  handleAddItem({
                    description: 'Dell OptiPlex Desktop PC Core i7 / 16GB RAM / 512GB SSD',
                    assetTag: `TAG-PC-${Math.floor(1000 + Math.random() * 9000)}`,
                    qty: 1,
                    price: '650.00',
                    remarks: 'Power cable & DisplayPort cable included',
                  })
                }
                className="px-2.5 py-1 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/80 text-sky-300 font-semibold rounded text-[11px] whitespace-nowrap"
              >
                + PC
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddItem({
                    description: 'Dell Latitude 5530 15.6" i7-1265U / 16GB / 512GB SSD',
                    assetTag: 'TAG-LPT-5530',
                    qty: 1,
                    price: '920.00',
                    remarks: '65W USB-C Charger & Sleeve',
                  })
                }
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded text-[11px] whitespace-nowrap"
              >
                + Laptop
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddItem({
                    description: 'Dell 27" 4K IPS USB-C Monitor (S2722QC)',
                    assetTag: 'TAG-MON-2704',
                    qty: 1,
                    price: '340.00',
                    remarks: 'Power & Type-C cable',
                  })
                }
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded text-[11px] whitespace-nowrap"
              >
                + Monitor
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddItem({
                    description: 'Jabra Evolve2 65 Wireless Bluetooth Headset',
                    assetTag: 'TAG-AUD-6501',
                    qty: 1,
                    price: '160.00',
                    remarks: 'Charging dock & USB dongle',
                  })
                }
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded text-[11px] whitespace-nowrap"
              >
                + Headset
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddItem({
                    description: 'Apple iPhone 15 Pro 128GB Corporate Device',
                    assetTag: 'MOB-IPH-1502',
                    qty: 1,
                    price: '1050.00',
                    remarks: 'Glass protector & case installed',
                  })
                }
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded text-[11px] whitespace-nowrap"
              >
                + Smartphone
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {data.items.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-neutral-800 rounded-xl">
                  <p className="text-sm text-neutral-400">No assets in inventory table.</p>
                  <button
                    onClick={() => handleAddItem()}
                    className="mt-2 text-xs text-sky-400 hover:underline"
                  >
                    Click here to add the first item
                  </button>
                </div>
              ) : (
                data.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-neutral-850/60 border border-neutral-800 rounded-lg space-y-2 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-[10.5px] font-mono text-neutral-300">
                          {item.nr || idx + 1}
                        </span>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Asset description (e.g. Lenovo ThinkPad L15)"
                          className="px-2.5 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100 w-64 md:w-80 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateItem(item)}
                          title="Duplicate item"
                          className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          title="Delete item"
                          className="p-1 text-neutral-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">
                          Asset Tag
                        </label>
                        <input
                          type="text"
                          value={item.assetTag}
                          onChange={(e) => handleUpdateItem(item.id, 'assetTag', e.target.value)}
                          placeholder="TAG-..."
                          className="w-full px-2 py-1 text-xs font-mono bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(item.id, 'qty', e.target.value)}
                          className="w-full px-2 py-1 text-xs font-mono bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">
                          Price / Val ({data.formatting.currency})
                        </label>
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-2 py-1 text-xs font-mono bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">
                          Remarks / Condition
                        </label>
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => handleUpdateItem(item.id, 'remarks', e.target.value)}
                          placeholder="Accessories / Condition"
                          className="w-full px-2 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: LEGAL & SIGNATURES */}
        {activeTab === 'legal' && (
          <div className="space-y-4">
            {/* Department Head Signature */}
            <div className="p-3 bg-neutral-850/60 border border-neutral-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200">
                  PL / TL Department Head
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSignatureModal('plTl')}
                  className="px-2.5 py-1 text-xs font-medium text-sky-400 bg-sky-950/60 border border-sky-800/80 rounded hover:bg-sky-900/60 transition-colors"
                >
                  {data.plTlSignature ? 'Change Signature' : 'Add Signature'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] text-neutral-400 mb-1">Header Label</label>
                  <input
                    type="text"
                    value={data.plTlTitle}
                    onChange={(e) => updateField('plTlTitle', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] text-neutral-400 mb-1">Signer Name / Title</label>
                  <input
                    type="text"
                    value={data.plTlName}
                    onChange={(e) => updateField('plTlName', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>
              </div>

              {data.plTlSignature && (
                <div className="flex items-center gap-3 p-2 bg-white rounded border border-neutral-300">
                  <img src={data.plTlSignature} alt="PL/TL" className="h-8 max-w-[120px] object-contain" />
                  <button
                    type="button"
                    onClick={() => updateField('plTlSignature', '')}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* IT Department Signature */}
            <div className="p-3 bg-neutral-850/60 border border-neutral-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200">
                  IT Department Representative
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSignatureModal('itDept')}
                  className="px-2.5 py-1 text-xs font-medium text-sky-400 bg-sky-950/60 border border-sky-800/80 rounded hover:bg-sky-900/60 transition-colors"
                >
                  {data.itDeptSignature ? 'Change Signature' : 'Add Signature'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] text-neutral-400 mb-1">Header Label</label>
                  <input
                    type="text"
                    value={data.itDeptTitle}
                    onChange={(e) => updateField('itDeptTitle', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] text-neutral-400 mb-1">
                    Signer Person (Handover BY)
                  </label>
                  <select
                    value={data.itDeptName || data.handoverBy}
                    onChange={(e) => {
                      const newPerson = e.target.value;
                      onChange({
                        ...data,
                        handoverBy: newPerson,
                        itDeptName: newPerson,
                        itDeptSignature: '',
                      });
                    }}
                    className="w-full px-2.5 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100 cursor-pointer"
                  >
                    {HANDOVER_BY_OPTIONS.map((person) => (
                      <option key={person} value={person}>
                        {person}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {data.itDeptSignature && (
                <div className="flex items-center gap-3 p-2 bg-white rounded border border-neutral-300">
                  <img src={data.itDeptSignature} alt="IT Dept" className="h-8 max-w-[120px] object-contain" />
                  <button
                    type="button"
                    onClick={() => updateField('itDeptSignature', '')}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Declaration Text Box */}
            <div className="pt-2 border-t border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-neutral-300">
                  Declaration Statement
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-neutral-400">Salutation:</span>
                  <select
                    value={data.employeeSalutation}
                    onChange={(e) => updateField('employeeSalutation', e.target.value)}
                    className="px-1.5 py-0.5 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-200"
                  >
                    <option value="Ms./Mr.">Ms./Mr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={4}
                value={data.declarationText}
                onChange={(e) => updateField('declarationText', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-sky-500"
              />
              <p className="text-[10.5px] text-neutral-400">
                Variables supported: <code className="text-sky-300 font-mono">{'{salutation}'}</code>,{' '}
                <code className="text-sky-300 font-mono">{'{employeeName}'}</code>,{' '}
                <code className="text-sky-300 font-mono">{'{companyName}'}</code>
              </p>
            </div>

            {/* Employee Signature & Remarks */}
            <div className="p-3 bg-neutral-850/60 border border-neutral-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200">
                  Employee Signature & Remarks
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSignatureModal('employee')}
                  className="px-2.5 py-1 text-xs font-medium text-sky-400 bg-sky-950/60 border border-sky-800/80 rounded hover:bg-sky-900/60 transition-colors"
                >
                  {data.employeeSignature ? 'Change Signature' : 'Add Signature'}
                </button>
              </div>

              <div>
                <label className="block text-[10.5px] text-neutral-400 mb-1">Other Remarks</label>
                <textarea
                  rows={2}
                  value={data.otherRemarks}
                  onChange={(e) => updateField('otherRemarks', e.target.value)}
                  placeholder="Notes, inspection conditions, serial verification..."
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] text-neutral-400 mb-1">Signed Date</label>
                  <input
                    type="date"
                    value={data.employeeSignedDate}
                    onChange={(e) => updateField('employeeSignedDate', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] text-neutral-400 mb-1">Document Reference</label>
                  <input
                    type="text"
                    value={data.documentRef}
                    onChange={(e) => updateField('documentRef', e.target.value)}
                    placeholder="e.g. DOC-KIK-HF-2026"
                    className="w-full px-2.5 py-1 text-xs font-mono bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>
              </div>

              {data.employeeSignature && (
                <div className="flex items-center gap-3 p-2 bg-white rounded border border-neutral-300">
                  <img src={data.employeeSignature} alt="Employee" className="h-8 max-w-[120px] object-contain" />
                  <button
                    type="button"
                    onClick={() => updateField('employeeSignature', '')}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* End of Form Tabs */}
      </div>
    </div>
  );
};
