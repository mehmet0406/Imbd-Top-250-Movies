
/*HTML'de Row var ya da yok durumundaki islemler*/

function showInfo() {
 var infoDiv = document.querySelector('.info');
 infoDiv.style.opacity = '1';
 setTimeout(function () {
   infoDiv.style.display = 'block';
 }, 700);
}
function closeInfo() {
 var infoDiv = document.querySelector('.info');
 infoDiv.style.opacity = '0';
 setTimeout(function () {
   infoDiv.style.display = 'none';
 }, 700);
}
function hideBodySkeleton() {
 var animateDiv = document.querySelector('.skeleton-animate');
 if (animateDiv) {
   animateDiv.style.display = 'none';
 }
}

var tableExists = document.querySelector('.table');

if (tableExists) {
 hideBodySkeleton();
} else {
 setTimeout(function () {
   var tableStillExists = document.querySelector('.table');
   if (!tableStillExists) {
     showInfo()
   }
 }, 3000);
}


/*RESPONSIZE*/
let nav_page = document.querySelector('.nav-page')
let table_container = document.querySelector('.table-container')
let burger = document.querySelector('.burger')
function resize() {
 if (window.matchMedia("(max-width:768px)").matches) {
   nav_page.classList.toggle('resize_nav-page-2')
   table_container.classList.toggle('resize_table-container-2')
 } else {
   nav_page.classList.toggle('resize_nav-page')
   table_container.classList.toggle('resize_table-container')
   if (nav_page.classList.contains('nav-page')) {
     nav_page.classList.remove('resize_nav-page-2')
     table_container.classList.remove('resize_table-container-2')
   }
 }
}
burger.addEventListener('click', resize)

/*Search-API*/



function searchMovies() {
 const baseUrl = "https://imdb-api.com/en/API/SearchAll/";
 const apiKey = localStorage.getItem("selectedApiKey");
 const searchTerm = document.querySelector(".form-control").value;

 const url = `${baseUrl}${apiKey}/${searchTerm}`;
 let search_list = document.querySelector('.search-list')
 search_list.innerHTML = '';



 fetch(url)
   .then(response => response.json())
   .then(data => {

     data.results.map(result => {
       let title = result.title
       let image = result.image

       let search_list = document.querySelector('.search-list')
       let list = document.createElement('div')
       list.classList.add('search-list-item')
       list.innerHTML = `
     <div class="search-img "><img class="search-img" src="${image}"  alt="image Not Found"></div>
     <div class="search-head"><a href="../films/index.html?id=${result.id}">${result.title}</a></div>
   `
       search_list.append(list)

       console.log(url)
     })

   })
   .catch(error => console.log(error));
}
searchMovies()
const searchList = document.querySelector(".search-list");
const input = document.querySelector(".form-control");

input.addEventListener("click", function () {
 searchList.style.display = "block";
});

window.addEventListener("click", function (event) {
 const clickedElement = event.target;

 if (!clickedElement.classList.contains("search-list-item") && !clickedElement.classList.contains("form-control")) {
   searchList.style.display = "none";
 }
});






/*API*/
function fetchDataFromFirstAPI() {
 const apiKey = localStorage.getItem("selectedApiKey");
 const cachedData = localStorage.getItem('api_1');

 if (cachedData) {
   return Promise.resolve(JSON.parse(cachedData));
 } else {
   return fetch(`https://imdb-api.com/en/API/Top250Movies/${apiKey}`)
     .then(response => response.json())
     .then(data => {
       localStorage.setItem('api_1', JSON.stringify(data));
       return data;
     });
 }
}

function fetchDataFromSecondAPI(filmId) {
 hideBodySkeleton()
 const apiKey = localStorage.getItem("selectedApiKey");
 const cachedData = localStorage.getItem(filmId);
 if (cachedData) {
   return Promise.resolve(JSON.parse(cachedData));
 } else {
   return fetch(`https://imdb-api.com/en/API/Title/${apiKey}/${filmId}`)
     .then(response => response.json())
     .then(data => {
       localStorage.setItem(filmId, JSON.stringify(data));
       return data;
     });
 }
}

var table = document.querySelector('.div-table-body');
var content = document.createElement('div');
content.classList.add('div-table-content');
table.append(content);

var loadedFilmCount = 0; 
var totalFilmCount = 250; 

var loadmore = function () {
 if (loadedFilmCount >= totalFilmCount) {
   return;
 }

 const filmsToLoad = Math.min(15, totalFilmCount - loadedFilmCount);
 const filmIds = [];

 for (let i = loadedFilmCount; i < loadedFilmCount + filmsToLoad; i++) {
   fetchDataFromFirstAPI()
     .then(data => {
       
       const film = data.items[i];
       filmIds.push(film.id);
 

       let row = document.createElement('div');
       row.classList.add('div-table-row');
           
       row.innerHTML = `
         <div class="div-table-col table poster">
           <img class="lazyload" data-src="${film.image}" alt="" ">
         </div>
         <div class="div-table-col table rank">${film.rank}</div>
         <div class="div-table-col table title">
           <a href="../films/index.html?id=${film.id}">${film.title}</a>
         </div>
         <div class="div-table-col table year">${film.year}</div>
         <div class="div-table-col table genre"></div>
         <div class="div-table-col table rating imbd-rating-count">
           <div class="imbd-rating">
             <span>
               <svg style="height: 22px;" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                 <path d="M91.046 111.818a5.85 5.85 0 0 1-3.341-1.049C87.188 110.402 68.92 97.098 64 93.515L40.336 110.74c-1.039.717-2.194 1.078-3.382 1.078-3.228 0-5.854-2.636-5.854-5.877 0-.639.114-1.305.339-1.98l.038-.105c.253-.71 6.214-18.996 9.008-27.575-7.342-5.364-23.014-16.808-23.653-17.25a5.9 5.9 0 0 1-2.524-4.834c0-3.305 2.608-5.994 5.815-5.994h29.346l8.933-27.59c.687-2.446 2.998-4.207 5.599-4.207 2.604 0 4.915 1.762 5.622 4.283l8.947 27.514h29.35c3.185 0 5.775 2.679 5.775 5.974 0 1.932-.936 3.74-2.502 4.838-.671.463-16.339 11.903-23.678 17.265 2.797 8.586 8.764 26.887 9.025 27.621.246.727.361 1.396.361 2.041 0 3.241-2.627 5.876-5.855 5.876zM64 88.566l1.178.856c8.396 6.116 24.391 17.764 24.824 18.072.299.206.669.323 1.044.323a1.868 1.868 0 0 0 1.855-1.877c0-.209-.045-.447-.133-.709-.148-.371-6.698-20.473-9.506-29.094l-.449-1.378 1.171-.854c2.486-1.818 24.313-17.764 24.944-18.188.468-.329.766-.913.766-1.541 0-1.069-.813-1.974-1.775-1.974H75.663l-9.869-30.355c-.252-.894-.964-1.441-1.794-1.441-.829 0-1.541.549-1.771 1.366l-9.85 30.431H20.123c-.984 0-1.815.914-1.815 1.994 0 .617.298 1.193.797 1.543.6.403 22.425 16.349 24.911 18.167l1.171.854-.449 1.379c-2.716 8.344-8.937 27.436-9.504 29.086h.001a2.31 2.31 0 0 0-.134.717c0 1.035.831 1.877 1.854 1.877.38 0 .74-.114 1.071-.342L64 88.566z" fill="#e8a71c" class="fill-000000"></path>
               </svg>
             </span>
             <span>${film.imDbRating}</span>
           </div>
           ${film.imDbRatingCount}
         </div>`;

       content.append(row);

       // İkinci API'den genre bilgisini alıp ilgili alana yerleştirme
       fetchDataFromSecondAPI(film.id)
         .then(filmData => {
           const genreElement = row.querySelector('.div-table-col.genre');
           genreElement.textContent = filmData.genres;
         })
         .catch(error => {
           console.log('Genre bilgisi alınırken bir hata oluştu:', error);
         });
     })
     .catch(error => {
       console.log('Veri alınırken bir hata oluştu:', error);
     });
 }

 const fetchDataPromises = filmIds.map(filmId => fetchDataFromSecondAPI(filmId));
 Promise.all(fetchDataPromises)
   .then(filmDataArray => {
    
   })
   .catch(error => {
     console.log('Veri alınırken bir hata oluştu:', error);
   });

 loadedFilmCount += filmsToLoad;
};

table.addEventListener('scroll', function () {
 if (table.scrollTop + table.clientHeight >= table.scrollHeight) {
   loadmore();
 }
});

fetchDataFromFirstAPI()
 .then(data => {
   totalFilmCount = data.items.length;
   loadmore();
 })
 .catch(error => {
   console.log('Veri alınırken bir hata oluştu:', error);
 });



 var Table_body = document.querySelector('.div-table-body')
 var nextItem = 1;

 let skeleton = document.createElement('div')
 skeleton.classList.add('skeleton-animate')

 var skeleton_animate = function () {
   for (i = 1; i < 15; i++) {
     var item = document.createElement('div')
     item.classList.add('body-skeleton')
     item.innerHTML = `
       <div class="body-row-skeleton poster "><img src="/transparent.png" alt=""></div>
               <div class="body-row-skeleton rank ">
                 <div class="rank-2"></div>
               </div>
               <div class="body-row-skeleton title ">
                 <div class="title-skeleton">
                   <div class="title-1"></div>
                   <div class="title-2"></div>
                 </div>
               </div>
               <div class="body-row-skeleton year ">
                 <div class="year-2"></div>
               </div>
               <div class="body-row-skeleton genre ">
                 <div class="genre-1"></div>
                 <div class="genre-2"></div>
                 <div class="genre-3"></div>
               </div>
               <div class="body-row-skeleton rating imbd-rating-count ">
                 <div class="rating-2"></div>
               </div>
       `

     Table_body.append(skeleton)
     skeleton.append(item)


   }
 }



 skeleton_animate()


 var list = document.querySelector('.search-list-item');
 input.addEventListener('input',function(){
  if (list) {
 hideBodySkeleton();
} else {
 setTimeout(function () {
   var search_list = document.querySelector('.search-list-item');
   if (!search_list) {
     showInfo()
   }
 }, 5000);
}
})