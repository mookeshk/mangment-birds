"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export default function BirdModal({ isOpen, onClose, onAdded, birdToEdit }: { isOpen: boolean, onClose: () => void, onAdded: () => void, birdToEdit?: any }) {
    const { fetchWithAuth } = useAuth();
    const [species, setSpecies] = useState<any[]>([]);
    const [breeds, setBreeds] = useState<any[]>([]);
    
    const [selectedSpecies, setSelectedSpecies] = useState("");
    const [selectedBreed, setSelectedBreed] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [isMale, setIsMale] = useState("true");
    const [status, setStatus] = useState("0");
    const [hatchDate, setHatchDate] = useState("");
    const [pairingDate, setPairingDate] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Quick Add States
    const [isAddingSpecies, setIsAddingSpecies] = useState(false);
    const [newSpeciesName, setNewSpeciesName] = useState("");
    
    const [isAddingBreed, setIsAddingBreed] = useState(false);
    const [newBreedName, setNewBreedName] = useState("");

    useEffect(() => {
        if (isOpen) {
            loadSpecies();
            if (birdToEdit) {
                setIdentifier(birdToEdit.identifier || "");
                setSelectedSpecies(birdToEdit.speciesId?.toString() || "");
                setSelectedBreed(birdToEdit.breedId?.toString() || "");
                setIsMale(birdToEdit.isMale === true ? "true" : birdToEdit.isMale === false ? "false" : "unknown");
                setStatus(birdToEdit.status?.toString() || "0");
                setHatchDate(birdToEdit.hatchDate ? birdToEdit.hatchDate.split('T')[0] : "");
                setPairingDate(birdToEdit.pairingDate ? birdToEdit.pairingDate.split('T')[0] : "");
                setPhotoUrl(birdToEdit.photoUrl || null);
            } else {
                setIdentifier("");
                setSelectedSpecies("");
                setSelectedBreed("");
                setIsMale("true");
                setStatus("0");
                setHatchDate("");
                setPairingDate("");
                setPhotoUrl(null);
            }
        }
    }, [isOpen, birdToEdit]);

    useEffect(() => {
        if (selectedSpecies) {
            loadBreeds(Number(selectedSpecies));
        } else {
            setBreeds([]);
        }
    }, [selectedSpecies]);

    const loadSpecies = async () => {
        const res = await fetchWithAuth('/api/species');
        if (res.ok) {
            setSpecies(await res.json());
        }
    };

    const loadBreeds = async (speciesId: number) => {
        const res = await fetchWithAuth(`/api/breeds?speciesId=${speciesId}`);
        if (res.ok) {
            setBreeds(await res.json());
        }
    };

    const handleQuickAddSpecies = async () => {
        if (!newSpeciesName.trim()) return;
        const res = await fetchWithAuth('/api/species', {
            method: 'POST',
            body: JSON.stringify({ name: newSpeciesName.trim() })
        });
        if (res.ok) {
            const data = await res.json();
            setSpecies([...species, data]);
            setSelectedSpecies(data.id.toString());
            setIsAddingSpecies(false);
            setNewSpeciesName("");
        }
    };

    const handleQuickAddBreed = async () => {
        if (!newBreedName.trim() || !selectedSpecies) return;
        const res = await fetchWithAuth('/api/breeds', {
            method: 'POST',
            body: JSON.stringify({ name: newBreedName.trim(), speciesId: Number(selectedSpecies) })
        });
        if (res.ok) {
            const data = await res.json();
            setBreeds([...breeds, data]);
            setSelectedBreed(data.id.toString());
            setIsAddingBreed(false);
            setNewBreedName("");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch('https://mangment-birds-api.onrender.com/api/birds/upload', {
            method: 'POST',
            
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            setPhotoUrl(data.url);
        }
        setIsUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            identifier,
            speciesId: selectedSpecies ? Number(selectedSpecies) : null,
            breedId: selectedBreed ? Number(selectedBreed) : null,
            isMale: isMale === "unknown" ? null : isMale === "true",
            status: parseInt(status),
            hatchDate: hatchDate ? new Date(hatchDate).toISOString() : null,
            pairingDate: status === "2" && pairingDate ? new Date(pairingDate).toISOString() : null,
            salePrice: status === "5" && salePrice ? parseFloat(salePrice) : null,
            buyerName: status === "5" ? buyerName : null,
            photoUrl: photoUrl
        };
        
        const method = birdToEdit ? 'PUT' : 'POST';
        const url = birdToEdit ? `/api/birds/${birdToEdit.id}` : '/api/birds';

        const res = await fetchWithAuth(url, {
            method: method,
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            onAdded();
            onClose();
        } else {
            alert("حدث خطأ أثناء الحفظ");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden my-auto">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                    <h2 className="font-bold text-gray-800 dark:text-white">{birdToEdit ? "تعديل بيانات الطائر" : "إضافة طائر جديد"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center justify-center">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors bg-gray-50 dark:bg-slate-900 relative"
                        >
                            {isUploading ? (
                                <div className="text-sm text-gray-500">جاري الرفع...</div>
                            ) : photoUrl ? (
                                <img src={`https://mangment-birds-api.onrender.com${photoUrl}`} alt="طائر" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span className="text-xs">صورة</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">معرف الطائر (الرقم/الخاتم)</label>
                        <input required type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                    </div>

                    {/* Species */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">النوع</label>
                        {isAddingSpecies ? (
                            <div className="flex gap-2">
                                <input autoFocus type="text" value={newSpeciesName} onChange={e => setNewSpeciesName(e.target.value)} placeholder="اسم النوع الجديد..." className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50" />
                                <button type="button" onClick={handleQuickAddSpecies} className="bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-emerald-600">حفظ</button>
                                <button type="button" onClick={() => setIsAddingSpecies(false)} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-300">إلغاء</button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <select required value={selectedSpecies} onChange={e => setSelectedSpecies(e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50">
                                    <option value="">اختر النوع...</option>
                                    {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <button type="button" onClick={() => setIsAddingSpecies(true)} className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-2 rounded-lg text-sm hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400">+</button>
                            </div>
                        )}
                    </div>

                    {/* Breed */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الفصيلة</label>
                        {isAddingBreed ? (
                            <div className="flex gap-2">
                                <input autoFocus type="text" value={newBreedName} onChange={e => setNewBreedName(e.target.value)} placeholder="اسم الفصيلة الجديدة..." className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50" />
                                <button type="button" onClick={handleQuickAddBreed} className="bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-emerald-600">حفظ</button>
                                <button type="button" onClick={() => setIsAddingBreed(false)} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-300">إلغاء</button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <select disabled={!selectedSpecies} required value={selectedBreed} onChange={e => setSelectedBreed(e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50">
                                    <option value="">{selectedSpecies ? 'اختر الفصيلة...' : 'اختر النوع أولاً'}</option>
                                    {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                <button type="button" disabled={!selectedSpecies} onClick={() => setIsAddingBreed(true)} className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-2 rounded-lg text-sm hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 disabled:opacity-50">+</button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الجنس</label>
                            <select value={isMale} onChange={e => setIsMale(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50">
                                <option value="true">ذكر</option>
                                <option value="false">أنثى</option>
                                <option value="unknown">غير محدد</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50">
                                <option value="0">نمو</option>
                                <option value="1">منتج</option>
                                <option value="2">تزاوج</option>
                                <option value="3">عزل طبي</option>
                                <option value="4">نافق / تالف</option>
                                <option value="5">مباع</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ الفقس</label>
                            <input type="date" value={hatchDate} onChange={e => setHatchDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50" />
                        </div>
                        {status === "2" && (
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ التزاوج</label>
                                <input type="date" value={pairingDate} onChange={e => setPairingDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50" />
                            </div>
                        )}
                        {status === "5" && (
                            <>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">سعر البيع</label>
                                    <input type="number" placeholder="مثال: 150" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المشتري (اختياري)</label>
                                    <input type="text" placeholder="اسم العميل" value={buyerName} onChange={e => setBuyerName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50" />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-slate-700">إلغاء</button>
                        <button type="submit" className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-md shadow-emerald-500/20">{birdToEdit ? "حفظ التعديلات" : "إضافة الطائر"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


