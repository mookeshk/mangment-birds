"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
    email: string;
    farmName?: string;
    contactNumbers?: string;
    farmLogoUrl?: string;
    subscriptionEndDate?: string;
    packageName?: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => Promise<void>;
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    logout: async () => {},
    fetchWithAuth: async () => new Response(),
    refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/manage/info", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                
                // Fetch additional farm settings
                const farmRes = await fetch("/api/FarmSettings", { credentials: "include" });
                if (farmRes.ok) {
                    const farmData = await farmRes.json();
                    setUser({ 
                        email: data.email, 
                        farmName: farmData.farmName || "مزرعتي",
                        contactNumbers: farmData.contactNumbers,
                        farmLogoUrl: farmData.farmLogoUrl ? `/api${farmData.farmLogoUrl}` : undefined,
                        subscriptionEndDate: farmData.subscriptionEndDate,
                        packageName: farmData.packageName,
                        isAdmin: farmData.isAdmin || data.email === "eng.mo.keshk@gmail.com"
                    });
                } else {
                    setUser({ email: data.email, farmName: "مزرعتي", isAdmin: data.email === "eng.mo.keshk@gmail.com" });
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Failed to fetch user info", err);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await fetch("/api/logout", { method: 'POST', credentials: 'include' });
        } catch(e) {}
        setUser(null);
        router.push("/");
    };

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const baseUrl = "";
        const finalUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
        
        const isFormData = options.body instanceof FormData;
        
        const headers = new Headers(options.headers || {});
        if (!isFormData && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        const res = await fetch(finalUrl, {
            ...options,
            credentials: "include",
            headers,
        });

        if (res.status === 401) {
            setUser(null);
            router.push("/");
        }

        return res;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout, fetchWithAuth, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

