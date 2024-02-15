// FUNGSI TAMBAH BUKU
const tambahBuku = () => {
  const btnTambahBukuHeader = document.querySelector("#btnTambahBukuHeader");
  const btnTambahBukuModal = document.querySelector("#btnTambahBukuModal");

  btnTambahBukuHeader.addEventListener("click", () => {
    document.querySelector(".modalTambahBuku").style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  btnTambahBukuModal.addEventListener("click", () => {
    let books = JSON.parse(localStorage.getItem("books"));

    if (books == null) books = [];

    const book = {
      id: +new Date(),
      title: document.querySelector("#inputJudulBuku").value,
      author: document.querySelector("#inputPenulisBuku").value,
      year: parseInt(document.querySelector("#inputTahunBuku").value),
      isComplite: document.querySelector("#inputBukuSelesaiDiBaca").checked,
    };

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  });
};

// FUNGSI CARI BUKU
const cariBuku = () => {
  const btnCariBukuHeader = document.querySelector("#btnCariBukuHeader");
  const btnCari = document.querySelector("#btnCari");
  const inputCariBuku = document.querySelector(".btnCariBukuWrapper input");

  btnCariBukuHeader.addEventListener("click", () => {
    inputCariBuku.style.display = "block";
    btnCariBukuHeader.style.display = "none";
  });

  btnCari.addEventListener("click", () => {
    const inputJudulBuku = inputCariBuku.value.trim().toLowerCase();
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const foundBooks = books.filter((book) => book.title.toLowerCase().includes(inputJudulBuku));

    console.log(inputJudulBuku);

    if (foundBooks.length > 0) {
      renderBook(foundBooks);
    } else {
      alert("Buku yang anda cari tidak tersedia");
      location.reload();
    }
  });
};

// FUNGSI RENDER BUKU
const renderBook = (booksToRender) => {
  const bookWrapper = document.querySelector(".bookWrapper");
  const listSemuaBuku = document.querySelector(".listSemuaBuku");
  const listBelumSelesaiDiBaca = document.querySelector(".listBelumSelesaiDiBaca");
  const listSelesaiDiBaca = document.querySelector(".listSelesaiDiBaca");

  const renderSingleBook = (book) => {
    const bookImage = book.isComplite ? "./assets/img/green-book.png" : "./assets/img/yellow-book.png";
    const btnPindahBuku = book.isComplite ? "Belum selesai di baca" : "Selesai di baca";

    return `
      <article class="book_item" data-id=${book.id}>
        <div class='image-wrapper'>
          <img src=${bookImage} />
        </div>
        <div class='text-content-book'>
          <h3>${book.title}</h3>
          <p><strong>Penulis:</strong> ${book.author}</p>
          <p><strong>Tahun:</strong> ${book.year}</p>
          <div class="action">
            <button class="green">${btnPindahBuku}</button>
            <button class="red">Hapus buku</button>
          </div>
        </div>
      </article>
    `;
  };

  const renderBooks = (booksToRender) => {
    return booksToRender.map((book) => renderSingleBook(book)).join("");
  };

  const renderAllBooks = (booksToRender) => {
    const semuaBukuAktive = listSemuaBuku.classList.contains("active");
    const belumSelesaiDiBacaAktive = listBelumSelesaiDiBaca.classList.contains("active");
    const selesaiDiBacaAktive = listSelesaiDiBaca.classList.contains("active");

    const books = booksToRender || JSON.parse(localStorage.getItem("books")) || [];

    if (books.length === 0) {
      bookWrapper.innerHTML = `<p style="color: white">Buku belum tersedia, Silahkan tambahkan buku..!</p>`;
      return;
    }

    if (selesaiDiBacaAktive) {
      bookWrapper.innerHTML = renderBooks(books.filter((book) => book.isComplite));
    } else if (belumSelesaiDiBacaAktive) {
      bookWrapper.innerHTML = renderBooks(books.filter((book) => !book.isComplite));
    } else if (semuaBukuAktive) {
      bookWrapper.innerHTML = renderBooks(books);
    }
  };

  const setActive = (activeList, otherLists) => {
    otherLists.forEach((list) => list.classList.remove("active"));
    activeList.classList.add("active");
  };

  listSemuaBuku.addEventListener("click", () => {
    setActive(listSemuaBuku, [listBelumSelesaiDiBaca, listSelesaiDiBaca]);
    renderAllBooks();
  });

  listBelumSelesaiDiBaca.addEventListener("click", () => {
    setActive(listBelumSelesaiDiBaca, [listSelesaiDiBaca, listSemuaBuku]);
    renderAllBooks();
  });

  listSelesaiDiBaca.addEventListener("click", () => {
    setActive(listSelesaiDiBaca, [listBelumSelesaiDiBaca, listSemuaBuku]);
    renderAllBooks();
  });

  if (booksToRender) {
    renderAllBooks(booksToRender);
  } else {
    renderAllBooks();
  }
};

// FUNGSI PINDAHKAN BUKU DAN HAPUS BUKU
const pindaHapusBuku = () => {
  document.querySelectorAll(".bookWrapper").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const target = event.target;

      // Pindahkan buku ke rak selesai di baca atau belum selesai di baca
      if (target.classList.contains("green")) {
        const bookId = target.parentElement.parentElement.parentElement.getAttribute("data-id");
        let books = JSON.parse(localStorage.getItem("books")) || [];
        const bookIndex = books.findIndex((book) => book.id == bookId);

        if (bookIndex !== -1) {
          books[bookIndex].isComplite = !books[bookIndex].isComplite;
          localStorage.setItem("books", JSON.stringify(books));
          renderBook();
        }
      }

      // Hapus buku
      if (target.classList.contains("red")) {
        const bookId = target.parentElement.parentElement.parentElement.getAttribute("data-id");
        const bookTitle = target.parentElement.parentElement.querySelector("h3").textContent;
        const confirmDelete = confirm(`Buku ${bookTitle} akan dihapus. Lanjutkan?`);

        if (confirmDelete) {
          let books = JSON.parse(localStorage.getItem("books")) || [];
          books = books.filter((book) => book.id != bookId);
          localStorage.setItem("books", JSON.stringify(books));
          renderBook("");
        }
      }
    });
  });
};

// FUNGSI PEMANGGIL
tambahBuku();
cariBuku();
renderBook();
pindaHapusBuku();
