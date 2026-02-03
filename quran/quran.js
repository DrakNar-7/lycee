const surahSelect = document.getElementById("surah-select");
const ayahsDiv = document.getElementById("ayahs");

// Load Surah list
fetch("https://api.alquran.cloud/v1/surah")
  .then(res => res.json())
  .then(data => {
    data.data.forEach(surah => {
      const option = document.createElement("option");
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.englishName}`;
      surahSelect.appendChild(option);
    });
    loadSurah(1); // Load Al-Fatiha by default
  });
// Load Surah content
function loadSurah(number) {
  fetch(`https://api.alquran.cloud/v1/surah/${number}`)
    .then(res => res.json())
    .then(data => {
      ayahsDiv.innerHTML = ""; // Clear current surah
      
      // Create a single container for all text
      const surahContainer = document.createElement("div");
      surahContainer.className = "ayah-container";

      data.data.ayahs.forEach(ayah => {
        // Create a span for the text and number so they don't break lines
        const ayahSpan = document.createElement("span");
        
        // Remove the "Bismillah" from the first ayah if it's not Surah Al-Fatiha 
        // and not Surah At-Tawbah (Optional logic)
        let text = ayah.text;
        
        ayahSpan.innerHTML = `${text} <span class="ayah-number">﴿${ayah.numberInSurah}﴾</span> `;
        surahContainer.appendChild(ayahSpan);
      });

      ayahsDiv.appendChild(surahContainer);
    });
}

surahSelect.addEventListener("change", e => {
  loadSurah(e.target.value);
});
