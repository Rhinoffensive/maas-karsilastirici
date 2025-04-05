import { useState } from "react";
import salaryData from "./data/maaslar.json";
import endeksData from "./data/endeks.json";

const months = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

import { useEffect } from "react";

export default function MaasHesaplayici() {
  const localStorageKey = "userSalariesData";

  const [totalTL, setTotalTL] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalGold, setTotalGold] = useState(0);
  const roleStorageKey = "selectedRole";
  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem(roleStorageKey) || "Araştırma Görevlisi";
  });
  const [userSalaries, setUserSalaries] = useState(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) return JSON.parse(saved);

    const initial = {};
    const roleSalaries = salaryData.roles[selectedRole];
    Object.entries(roleSalaries).forEach(([year, monthsObj]) => {
      initial[year] = {};
      months.forEach((month) => {
        if (monthsObj[month]) {
          initial[year][month] = monthsObj[month];
        }
      });
    });
    return initial;
  });

  useEffect(() => {
    recalculateTotals(userSalaries);
  }, []);

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    localStorage.setItem(roleStorageKey, role);

    const initial = {};
    const roleSalaries = salaryData.roles[role];
    Object.entries(roleSalaries).forEach(([year, monthsObj]) => {
      initial[year] = {};
      months.forEach((month) => {
        if (monthsObj[month]) {
          initial[year][month] = monthsObj[month];
        }
      });
    });
    setUserSalaries(initial);
    localStorage.setItem(localStorageKey, JSON.stringify(initial));
    recalculateTotals(initial);
  };

  const handleSalaryChange = (year, month, value) => {
    const updatedSalaries = {
      ...userSalaries,
      [year]: {
        ...userSalaries[year],
        [month]: value
      }
    };
    setUserSalaries(updatedSalaries);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedSalaries));
    recalculateTotals(updatedSalaries);
  };

  const recalculateTotals = (salaries) => {
    const roleSalaries = salaryData.roles[selectedRole];
    let tl = 0;
    let usd = 0;
    let gold = 0;

    Object.entries(roleSalaries).forEach(([year, monthsObj]) => {
      months.forEach((month) => {
        const devletMaas = monthsObj[month];
        const kullaniciMaas = salaries?.[year]?.[month];
        if (devletMaas && kullaniciMaas) {
          const fark = devletMaas - Number(kullaniciMaas);
          const kur = endeksData.exchange_rates?.[year]?.[month];
          if (kur && fark) {
            tl += fark;
            usd += fark / kur.usd_try;
            gold += fark / kur.gold_try;
          }
        }
      });
    });

    setTotalTL(tl);
    setTotalUSD(usd);
    setTotalGold(gold);
  };

  const renderSalaryTable = () => {
    const roleSalaries = salaryData.roles[selectedRole];

    return Object.entries(roleSalaries).map(([year, salaries]) => (
      <div key={year} className="mb-6">
        <h3 className="font-semibold text-lg mb-2">{year}</h3>
        <div className="flex flex-wrap gap-4">
          {months.map((month, index) => {
            const monthNumber = index + 1;
            const currentYear = Number(year);
            const isDisabled =
              (currentYear === 2020 && monthNumber < 5) ||
              (currentYear === 2025 && monthNumber > 4);

            const devletMaas = salaries[month] || null;
            const kullaniciMaas = userSalaries?.[year]?.[month] || null;
            const fark = devletMaas && kullaniciMaas ? devletMaas - Number(kullaniciMaas) : null;
            const yuzde = fark !== null && kullaniciMaas ? ((fark / devletMaas) * 100).toFixed(1) : null;

            return isDisabled ? (
              <div key={month} className="w-[140px] border p-3 rounded-lg shadow-sm text-sm opacity-40 pointer-events-none">
                <div className="font-medium mb-1">{month}</div>
                <div className="mb-1">Devlet: -</div>
                <input
                  type="number"
                  disabled
                  className="w-full border rounded px-2 py-1 text-sm mb-1 bg-gray-100"
                />
              </div>
            ) : (
              <div key={month} className="w-[140px] border p-3 rounded-lg shadow-sm text-sm">
                <div className="font-medium mb-1">{month}</div>
                <div className="mb-1">Devlet: {devletMaas ? devletMaas.toLocaleString("tr-TR") + " TL" : "-"}</div>
                <input
                  type="number"
                  step={devletMaas ? Math.round(devletMaas / 30) : 100}
                  value={userSalaries?.[year]?.hasOwnProperty(month) ? kullaniciMaas : devletMaas}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onChange={(e) => handleSalaryChange(year, month, e.target.value === "" ? 0 : e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm mb-1"
                />
                {fark !== null && (
                  <div className="text-xs">
                    Fark: {fark.toLocaleString("tr-TR")} TL ({yuzde}% daha az)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  const handleExportCSV = () => {
    const roleSalaries = salaryData.roles[selectedRole];
    const rows = [[
      "Yıl", "Ay", "Devlet Maaşı", "Kullanıcı Maaşı", "Fark (TL)", "Fark (USD)", "Fark (Altın gr)", "USD Kuru", "Altın Kuru", "Kümülatif Fark (TL)", "Kümülatif Fark (USD)", "Kümülatif Fark (Altın gr)"
    ]];

    let cumulative = 0;
    let cumulativeUSD = 0;
    let cumulativeGold = 0;

    Object.entries(roleSalaries).forEach(([year, monthsObj]) => {
      months.forEach((month, i) => {
        const monthNum = i + 1;
        const currentYear = Number(year);
        const isDisabled =
          (currentYear === 2020 && monthNum < 5) ||
          (currentYear === 2025 && monthNum > 3);
        if (isDisabled) return;

        const devletMaas = monthsObj[month];
        const kullaniciMaas = Number(userSalaries?.[year]?.[month] ?? devletMaas);
        const fark = devletMaas - kullaniciMaas;
        const kur = endeksData.exchange_rates?.[year]?.[month] || {};
        const usd = kur.usd_try ? (fark / kur.usd_try) : "";
        const gold = kur.gold_try ? (fark / kur.gold_try) : "";

        cumulative += fark;
        cumulativeUSD += usd || 0;
        cumulativeGold += gold || 0;

        rows.push([
          year,
          month,
          devletMaas,
          kullaniciMaas,
          fark,
          usd ? usd.toFixed(2) : "",
          gold ? gold.toFixed(2) : "",
          kur.usd_try || "",
          kur.gold_try || "",
          cumulative,
          cumulativeUSD ? cumulativeUSD.toFixed(2) : "",
          cumulativeGold ? cumulativeGold.toFixed(2) : ""
        ]);
      });
    });

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedRole.replace(/ /g, "_")}_maas_karsilastirma.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto min-h-screen">
            
      <h1 className="text-3xl font-bold mb-6">Devlet ve Vakıf Maaş Karşılaştırması</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="w-[140px] border p-3 rounded-lg shadow-sm text-sm flex flex-col items-center">
          <div className="text-2xl">💰</div>
          <div className="font-semibold">TL</div>
          <div className="text-sm">Toplam Fark</div>
          <div className="font-bold">{totalTL.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL</div>
        </div>
        <div className="w-[140px] border p-3 rounded-lg shadow-sm text-sm flex flex-col items-center">
          <div className="text-2xl">💵</div>
          <div className="font-semibold">USD</div>
          <div className="text-sm">Toplam Fark</div>
          <div className="font-bold">{totalUSD.toFixed(2)} $</div>
        </div>
        <div className="w-[140px] border p-3 rounded-lg shadow-sm text-sm flex flex-col items-center">
          <div className="text-2xl">🥇</div>
          <div className="font-semibold">Altın</div>
          <div className="text-sm">Toplam Fark</div>
          <div className="font-bold">{totalGold.toFixed(2)} gr</div>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-4 mb-6">
  <div>
    <label className="block mb-2">Akademik Unvan Seçin:</label>
    <select value={selectedRole} onChange={handleRoleChange} className="p-2 border border-gray-300 bg-white text-gray-800 rounded">
      {Object.keys(salaryData.roles).map((role) => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  </div>
  <div className="flex gap-4">
    <button
      onClick={handleExportCSV}
      className="px-4 py-2 bg-blue-100 text-blue-800 border border-blue-300 rounded hover:bg-blue-200"
    >
      CSV Dışa Aktar
    </button>
    <button
      onClick={() => {
        localStorage.removeItem(localStorageKey);
        localStorage.removeItem(roleStorageKey);
        setUserSalaries({});
        recalculateTotals({});
      }}
      className="px-4 py-2 bg-red-100 text-red-800 border border-red-300 rounded hover:bg-red-200"
    >
      Verileri Sıfırla
    </button>
  </div>
</div>

      {renderSalaryTable()}
    </div>
  );
}
