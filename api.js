const base_url = 'http://127.0.0.1:8000/api/v1/'
const sliders_container_class = 'sliders_container'
const best_movie_id = "best-movie"
function get_movies_by_category(category, max_movies) {
    let movies = [];
    let pagenumber = 1;
    let xhr = new XMLHttpRequest();

    // On utilise une boucle while pour récupérer toutes les pages de résultats
    while (movies.length < max_movies) {
        let url = base_url + "titles?genre=" + category + "&page=" + pagenumber;
        xhr.open("GET", url, false); // On passe le paramètre false pour synchroniser les appels Ajax
        xhr.send();

        if (xhr.status === 200) {
            let jsonload = JSON.parse(xhr.responseText);
            let number_of_movies = Object.keys(jsonload.results).length;
            for (let i = 0; i < number_of_movies; i++) {
                movies.push(jsonload.results[i]);
                if (movies.length >= max_movies) {
                    break; // On sort de la boucle si on a atteint le nombre maximal de films demandés
                }
            }

            if (jsonload.next === null) {
                break; // On sort de la boucle si on a atteint la dernière page de résultats
            }

            pagenumber++; // On passe à la page suivante
        } else {
            alert('Il y a eu un problème durant le chargement des données');
            break; // On sort de la boucle en cas d'erreur
        }
    }
    return movies.slice(0, max_movies);
}
function get_best_movie() {
    let xhr = new XMLHttpRequest();

    // On utilise une boucle while pour récupérer toutes les pages de résultats
    let url = base_url + "titles?sort_by=-imdb_score";
    xhr.open("GET", url, false); // On passe le paramètre false pour synchroniser les appels Ajax
    xhr.send();

    if (xhr.status === 200) {
        let jsonload = JSON.parse(xhr.responseText);
        let bestmovie_id = (jsonload.results[0].id)
        let bestmovie = get_movie_from_id(bestmovie_id)
        return bestmovie

    } else {
        alert('Il y a eu un problème durant le chargement des données');
    }
}

function get_bests_movies(max_movies) {
    let movies = [];
    let pagenumber = 1;
    let xhr = new XMLHttpRequest();

    // On utilise une boucle while pour récupérer toutes les pages de résultats
    while (movies.length < max_movies) {
        let url = base_url + "titles?sort_by=-imdb_score" + "&page=" + pagenumber;
        xhr.open("GET", url, false); // On passe le paramètre false pour synchroniser les appels Ajax
        xhr.send();
        if (xhr.status === 200) {
            let jsonload = JSON.parse(xhr.responseText);
            let number_of_movies = Object.keys(jsonload.results).length;
            for (let i = 0; i < number_of_movies; i++) {
                movies.push(jsonload.results[i]);
                if (movies.length >= max_movies) {
                    break; // On sort de la boucle si on a atteint le nombre maximal de films demandés
                }
            }
            if (jsonload.next === null) {
                break; // On sort de la boucle si on a atteint la dernière page de résultats
            }
            pagenumber++; // On passe à la page suivante
        } else {
            alert('Il y a eu un problème durant le chargement des données');
            break; // On sort de la boucle en cas d'erreur
        }

    }
    return movies.slice(0, max_movies);
}





function get_movies_ids_from_list(json) {
    ids = [];
    json.forEach(element => {
        ids.push(element['id'])
    });
    return ids
}
function get_movie_from_id(id) {
    let xhr = new XMLHttpRequest();

    // On utilise une boucle while pour récupérer toutes les pages de résultats
    let url = base_url + "titles/" + id;
    xhr.open("GET", url, false); // On passe le paramètre false pour synchroniser les appels Ajax
    xhr.send();

    if (xhr.status === 200) {
        let jsonload = JSON.parse(xhr.responseText);
        return jsonload
    }
    else {
        alert('Il y a eu un problème durant le chargement des données');
    }
}


/**
 * Create a movie thumbnail from the movie id, and add it to the slider with the given slider id.
 * @param id - the id of the movie
 * @param slider_id - the id of the div that the thumbnail will be added to
 */
function create_movie_thumbnail_from_id(id, slider_id) {
    movie = get_movie_from_id(id)
    add_div_to_slider(slider_id, movie.id)
    add_img_to_div(movie.id, movie.image_url)
}
function create_movie_title(title) {
    let h1 = document.createElement("h1");
    let textNode = document.createTextNode(title);
    h1.appendChild(textNode);
    h1.className = "best_movie_title";
    h1.setAttribute('id', 'best_movie_title')
    bestmovie_container = document.getElementById('best_movie_image_container')
    bestmovie_container.appendChild(h1)
}

function create_best_movie_div(container) {
    movie = get_best_movie()
    create_movie_title(movie.title)
    add_img_to_div(container, movie.image_url, movie.id, true)
    document.getElementById(best_movie_id).setAttribute('class', movie.id)
}

/**
 * It takes two arguments, the first is the id of the html element you want to add the image to, the
 * second is the url of the image you want to add.
 * @param html_id - the id of the div you want to add the image to
 * @param url - The URL of the image you want to add to the div.
 */
function add_img_to_div(html_id, url, id, onclick = false) {
    var img = document.createElement('img');
    img.src = url;
    img.setAttribute('id', id)
    if (onclick == true) {
        img.setAttribute('onclick', 'open_movie(this.id)')
    }
    document.getElementById(html_id).appendChild(img);

}
/**
 * It creates a new div element, sets its id attribute to the value of the id parameter, and then adds
 * it to the slider with the id of the slider_id parameter.
 * @param slider_id - the id of the slider you want to add the div to
 * @param id - the id of the div you want to add to the slider
 */
function add_div_to_slider(slider_id, id) {
    var slide = document.createElement('swiper-slide');
    slide.setAttribute('id', id)
    slide.setAttribute('onclick', 'open_movie(this.id)')
    document.getElementById(slider_id).appendChild(slide);
}

function add_movies_to_slider_by_category(category, number_of_slides, slider_html_id) {
    let category_movies = get_movies_by_category(category, number_of_slides);
    category_movies_id = get_movies_ids_from_list(category_movies);
    add_prev_arrow_to_slider(category)
    category_movies_id.forEach(element => {
        create_movie_thumbnail_from_id(element, slider_html_id)
    })
    add_next_arrow_to_slider(category)
    add_category_label(category, slider_html_id, category);
}
function add_prev_arrow_to_slider(category) {
    let section_name = category + "_section"
    const prevButtons = document.querySelectorAll('[class^="swiper-button-prev"]');
    numPrevButtons = prevButtons.length;
    let prev_arrow = document.createElement('span')
    prev_arrow.className = "swiper-button-prev-" + numPrevButtons
    prev_arrow.classList.add("material-symbols-outlined")
    prev_arrow.innerHTML += 'arrow_back_ios';
    document.getElementById(section_name).prepend(prev_arrow)
}
function add_next_arrow_to_slider(category) {
    let section_name = category + "_section"
    const nextButtons = document.querySelectorAll('[class^="swiper-button-next"]');
    numNextButtons = nextButtons.length;
    let next_arrow = document.createElement('span')
    next_arrow.className = "swiper-button-next-" + numNextButtons
    next_arrow.classList.add("material-symbols-outlined")
    next_arrow.innerHTML += 'arrow_forward_ios';
    document.getElementById(section_name).appendChild(next_arrow)
}

function add_bests_movies_to_slider(category, number_of_slides, slider_html_id) {
    let best_movies = get_bests_movies(number_of_slides);
    let best_movies_id = get_movies_ids_from_list(best_movies);
    add_prev_arrow_to_slider('best_movies', best = true)
    best_movies_id.forEach(element => {
        create_movie_thumbnail_from_id(element, slider_html_id)
    });
    add_next_arrow_to_slider('best_movies', best = true)
    add_category_label('best_movies', slider_html_id, category);
}

function add_category_label(category, slider_html_id, category_title) {
    let section_name = category + "_section"
    let h1 = document.createElement("h1");
    let textNode = document.createTextNode(category_title);
    h1.appendChild(textNode);
    h1.className = "categories_title";
    section = document.getElementById(section_name)
    section.prepend(h1);
}
function insertAfter(newElement, targetElement) {
    // target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;

    // if the parents lastchild is the targetElement...
    if (parent.lastChild == targetElement) {
        // add the newElement after the target element.
        parent.appendChild(newElement);
    } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
function formatTime(time) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours}h ${minutes < 10 ? `0${minutes}` : minutes}m`;
}

function open_best_movie() {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    let bestmovie_id = document.getElementById(best_movie_id).className
    open_movie(bestmovie_id)

}
function display_movie_infos() {
    let infos_window = document.getElementById('display_movie_infos')
    infos_window.style.display = 'inline-block'
}
function open_movie(id) {
    movie = get_movie_from_id(id)
    movie.duration = formatTime(movie.duration)
    if (movie.rated == 'Not rated or unkown rating') {
        movie.rated = 'Pas encore de vote'
    }
    if (movie.worldwide_gross_income == null) {
        movie.worldwide_gross_income = 'Non connu'
    }
    document.getElementById('movie_title').innerText = movie.title
    document.getElementById('movie_image').setAttribute('src', movie.image_url)
    document.getElementById('movie_description').innerText = movie.long_description
    document.getElementById('movie_date').innerText = movie.date_published
    document.getElementById('movie_director').innerText = movie.directors[0]
    document.getElementById('movie_time').innerText = movie.duration
    document.getElementById('movie_rated').innerText = movie.rated
    document.getElementById('movie_imdb').innerText = movie.imdb_score
    document.getElementById('movie_country').innerText = movie.countries[0]
    document.getElementById('movie_box_office').innerText = movie.worldwide_gross_income
    display_movie_infos()
    add_li_movie_infos('movie_actors', movie.actors)
    add_li_movie_infos('genres', movie.genres)

}
function add_li_movie_infos(id, elements) {
    let ul = document.getElementById(id);
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    for (let i = 0; i < elements.length; i++) {
        if (i < 14) {
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(elements[i]));
            ul.appendChild(li);
        }
        else {
            break
        }

    }

}
function swiper() {
    const swiperEl = document.querySelectorAll('swiper-container')
    for (i = 0; i < swiperEl.length; i++) {
        Object.assign(swiperEl[i], {
            slidesPerView: 3,
            spaceBetween: 0,
            navigation: true,
            navigation: {
                nextEl: '.swiper-button-next-' + i,
                prevEl: '.swiper-button-prev-' + i,
            },
            fadeEffect: {
                crossFade: true
            },

            pauseOnMouseEnter: true,
            autoplay: {
                delay: 3000,
            },
            disableOnInteraction: true,
            mousewheel: {
                forceToAxis: true,
                sensitivity: 5,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 70,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'bullets',
                    },
                    uniqueNavElements: true
                },
            },
        });
        swiperEl[i].initialize();
    }
}
function closebutton() {
    let infos_window = document.getElementById('display_movie_infos')
    infos_window.style.display = 'none'
}