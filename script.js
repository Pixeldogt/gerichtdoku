window.onload = () => {
  const savedPin = localStorage.getItem("ereignisAppPin");
  if (savedPin) {
    document.getElementById("pin").value = savedPin;
  }
};

async function submitData() {
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("time");
  // Kategorie: Radio-Buttons auslesen
  const categoryEls = document.getElementsByName("category");
  const descriptionEl = document.getElementById("description");
  const pinEl = document.getElementById("pin");
  const statusEl = document.getElementById("status");

  const description = descriptionEl.value.trim();
  if (!description) {
    statusEl.textContent = "Bitte Beschreibung eingeben.";
    return;
  }

  const PIN = pinEl.value.trim();
  if (!PIN) {
    statusEl.textContent = "Bitte PIN eingeben.";
    return;
  }

  // PIN speichern
  localStorage.setItem("ereignisAppPin", PIN);

  // Aktuelle Zeit
  const now = new Date();

  // Datum
  let formattedDate;
  if (dateEl.value) {
    const [yyyy, mm, dd] = dateEl.value.split("-");
    formattedDate = `${dd}.${mm}.${yyyy}.`;
  } else {
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    formattedDate = `${dd}.${mm}.${yyyy}.`;
  }

  // Uhrzeit
  let formattedTime;
  if (timeEl.value) {
    formattedTime = timeEl.value;
  } else {
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    formattedTime = `${hh}:${min}`;
  }

  // Ausgewählte Kategorie ermitteln
  let category = "Aktivität";
  for (const el of categoryEls) {
    if (el.checked) {
      category = el.value;
      break;
    }
  }

  statusEl.textContent = "Wird gespeichert...";

  try {
    await fetch("https://script.google.com/macros/s/AKfycbzFyVOpW6Lbg2tGfRHE9ETBTMs9SCDz17AhoNLDGtqrolqX3trbJpxGqWL5vGFw7PUK5Q/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pin: PIN,
        datum: formattedDate,
        uhrzeit: formattedTime,
        kategorie: category,
        beschreibung: description
      })
    });

    statusEl.textContent = "Gespeichert ✅";
    descriptionEl.value = "";
    timeEl.value = "";
    // Kategorie zurücksetzen auf "Aktivität"
    for (const el of categoryEls) {
      el.checked = el.value === "Aktivität";
    }
  } catch (error) {
    console.error("Fehler:", error);
    statusEl.textContent = "Fehler beim Speichern ❌";
  }
}

document.getElementById("minus5min").addEventListener("click", function() {
  const timeInput = document.getElementById("time");
  let [hh, mm] = timeInput.value
    ? timeInput.value.split(":").map(Number)
    : [new Date().getHours(), new Date().getMinutes()];
  let date = new Date();
  date.setHours(hh, mm, 0, 0);
  date.setMinutes(date.getMinutes() - 5);
  timeInput.value = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
});

document.getElementById("minus1min").addEventListener("click", function() {
  const timeInput = document.getElementById("time");
  let [hh, mm] = timeInput.value
    ? timeInput.value.split(":").map(Number)
    : [new Date().getHours(), new Date().getMinutes()];
  let date = new Date();
  date.setHours(hh, mm, 0, 0);
  date.setMinutes(date.getMinutes() - 1);
  timeInput.value = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
});
