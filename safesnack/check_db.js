const testUrls = {
  "CAKE": "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
  "SALAD": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
  "PANCAKES": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1000&auto=format&fit=crop",
  "PIZZA": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop",
  "TOAST1": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1000&auto=format&fit=crop",
  "TOAST2": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1000&auto=format&fit=crop",
  "HEALTHY1": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop",
  "PASTA2": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop",
  "FOOD1": "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1000&auto=format&fit=crop",
  "HEALTHY2": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
  "PLATTER": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
  "SALADBOWL": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"
};

async function main() {
  for (const [key, url] of Object.entries(testUrls)) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`${res.status}: ${key} -> ${url}`);
    } catch (e) {
      console.log(`FAILED: ${key} (${e.message})`);
    }
  }
}
main();
