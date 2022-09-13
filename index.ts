type PayRecord = {
    date: string,
    description: string,
    amount: number
};
type DateString = string;
type PayMap = Map<string, PayRecord[]>

const payMap: PayMap = new Map();
const records = document.querySelectorAll("#tab_content_tab_meisai_content .displayWideAndCompact table tbody tr");
records.forEach((record) => {
    addPayMap(record, payMap);
});

const paymentData = renderPayMap(payMap);
const meisai = document.getElementById("tab_content_tab_meisai_content");
if (meisai) {
    meisai.appendChild(paymentData);
}

function addPayMap(tr: Element, map: PayMap): void {
    if (tr.children.length !== 4) {
        return;
    }
    const date = tr.children[0].textContent?.trim();
    if (date === null) {
        return;
    }
    const description = tr.children[2].textContent?.trim();
    const amount = tr.children[3].textContent?.trim().replace(",", "").replace(/円$/, "");
    if (date === undefined || description === undefined || amount === undefined) {
        return;
    }
    const payRecord = {
        date, description, amount: parseInt(amount)
    };
    const oldValue = map.get(date) || [];
    oldValue.push(payRecord);
    map.set(date, oldValue);
}

function renderPayMap(payMap: PayMap): HTMLElement {
    const dayRecords = Array.from(payMap).map(([date, payRecords]) => {
        const dayTotal = payRecords.reduce((accum, payRecord) => accum + payRecord.amount, 0);
        const records = payRecords.map((payRecord) => {
            return e("tr", [
                e("td", [payRecord.description]),
                e("td", [payRecord.amount.toLocaleString() + "円"]),
            ])
        });
        return e("div", [
            e("h1", [`${date} 合計額: ${dayTotal.toLocaleString()}円`]),
            e("table",
                [e("thead", [
                    e("th", ["摘要"]),  e("th", ["金額"])
                ]),
                e("tbody", records)
                ]
            )
        ]);
    });


    return e("div", dayRecords.reverse());
}

function e(tagName: string, children: (HTMLElement | string)[]): HTMLElement {
    const element = document.createElement(tagName);
    children.forEach((child) => {
        if (typeof child === "string") {
            const node = document.createTextNode(child);
            element.appendChild(node);
        } else {
            element.appendChild(child);
        }
    });
    return element;
}
