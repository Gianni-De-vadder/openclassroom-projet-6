const base_url = 'http://127.0.0.1:8000/api/v1/'
const sliders_container_class = 'sliders_container'
const best_movie_id = "best-movie"

/**
 * It makes a series of AJAX calls to the API, and returns an array of movies
 * @param category - The category of movies you want to get.
 * @param max_movies - The maximum number of movies to return.
 * @returns An array of movies.
 */

async function get_movies_by_category(category, max_movies) {
    let movies = [];
    let pagenumber = 1;
    let url = base_url + "titles?genre=" + category + "&page=" + pagenumber;

    // On utilise une boucle while pour récupérer toutes les pages de résultats
    while (movies.length < max_movies) {
        const response = await fetch(url);

        if (response.ok) {
            let jsonload = await response.json();
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
            url = jsonload.next;
        } else {
            alert('Il y a eu un problème durant le chargement des données');
            break; // On sort de la boucle en cas d'erreur
        }
    }
    return movies.slice(0, max_movies);
}

async function get_bests_movies(max_movies) {
    let movies = [];
    let pagenumber = 1;
    let url = base_url + "titles?sort_by=-imdb_score" + "&page=" + pagenumber;


    // On utilise une boucle while pour récupérer toutes les pages de résultats
    while (movies.length < max_movies) {
        const response = await fetch(url);

        if (response.ok) {
            let jsonload = await response.json();
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
            url = jsonload.next;
        } else {
            alert('Il y a eu un problème durant le chargement des données');
            break; // On sort de la boucle en cas d'erreur
        }
    }
    return movies.slice(0, max_movies);
}

async function get_best_movie() {
    try {
        let url = base_url + "titles?sort_by=-imdb_score";
        let response = await fetch(url);
        if (response.ok) {
            let jsonload = await response.json();
            let bestmovie_id = jsonload.results[0].id;
            let bestmovie = await get_movie_from_id(bestmovie_id);
            return bestmovie;
        } else {
            throw new Error('Il y a eu un problème durant le chargement des données');
        }
    } catch (error) {
        console.error(error);
    }
}


function get_movies_ids_from_list(json) {
    ids = [];
    json.forEach(element => {
        ids.push(element['id'])
    });
    return ids
}
async function get_movie_from_id(id) {
    try {
        let url = base_url + "titles/" + id;
        let response = await fetch(url);
        if (response.ok) {
            let jsonload = await response.json();
            return jsonload;
        } else {
            throw new Error('Il y a eu un problème durant le chargement des données');
        }
    } catch (error) {
        console.error(error);
    }
}



/**
 * Create a movie thumbnail from the movie id, and add it to the slider with the given slider id.
 * @param id - the id of the movie
 * @param slider_id - the id of the div that the thumbnail will be added to
 */
async function create_movie_thumbnail_from_id(id, slider_id) {
    movie = await get_movie_from_id(id)
    add_div_to_slider(slider_id, movie.id)
    add_img_to_div(movie.id, movie.image_url, movie.id)
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

async function create_best_movie_div(container) {
    movie = await get_best_movie()
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

async function add_movies_to_slider_by_category(category, number_of_slides, slider_html_id) {
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

async function create_slider(category, section, number_of_slides = 7, best = false) {
    const slider_section = document.getElementById(section);
    let category_name = document.createElement('h1')
    let text = document.createTextNode(category)
    category_name.classList.add('categories_title')
    category_name.appendChild(text)
    slider_section.append(category_name)
    let slider_container = document.createElement('ul');
    slider_container.setAttribute('id', category + '_slider')
    slider_container.classList.add('slider_container');

    if (best == false) {
        movies = await get_movies_by_category(category, number_of_slides);
    }
    else if (best == true) {
        movies = await get_bests_movies(number_of_slides);

    }
    let left_arrow = create_arrow('left', category);
    slider_section.appendChild(left_arrow);
    slider_section.appendChild(slider_container)
    movies.forEach(movie => {
        let slide = create_slide(movie);
        slider_container.appendChild(slide)

    });
    let right_arrow = create_arrow('right', category);
    slider_section.appendChild(right_arrow);
}

// function add_slide_to_slider(category, slider) {
// }

function create_slide(movie) {
    let slide = document.createElement('li');
    let overlay = document.createElement('div');
    let movie_title = document.createElement('h3');
    let text = document.createTextNode(movie.title);
    let img = create_movie_image(movie, true)

    slide.classList.add('slide');
    overlay.classList.add('overlay');

    movie_title.appendChild(text)
    overlay.appendChild(movie_title)
    overlay.setAttribute('id', movie.id)
    overlay.setAttribute('onclick', 'open_movie(this.id)')

    slide.appendChild(overlay)
    slide.appendChild(img)
    console.log(movie)
    return slide
}
function create_movie_image(movie, onclick = false) {
    let img = document.createElement('img');
    img.src = movie.image_url;
    img.setAttribute('id', movie.id)
    if (onclick == true) {
        img.setAttribute('onclick', 'open_movie(this.id)')
    }
    return img

}

function create_arrow(direction, category) {
    let arrow = document.createElement('span')
    arrow.setAttribute('id', category + '_arrow')
    arrow.classList.add("material-symbols-outlined");
    arrow.classList.add("arrows");
    if (direction == 'left') {
        arrow.setAttribute('onclick', 'move_slider("left",this.id)')
        arrow.innerHTML += "arrow_back_ios";
    }
    else if (direction == 'right') {
        arrow.innerHTML += 'arrow_forward_ios';
        arrow.setAttribute('onclick', 'move_slider("right",this.id)')
    }
    return arrow
}

function move_slider(direction, arrow_id) {
    section_id = arrow_id.replace('_arrow', '_slider')
    slider = document.getElementById(section_id)
    slide = document.getElementsByClassName('slide')
    console.log(slider)
    if (direction == 'left') {
        console.log('left')
        let calc = slider.scrollLeft - (slide[0].offsetWidth * 2)
        slider.scrollTo({
            left: calc,
            behavior: 'smooth',
        });
    }
    else if (direction == 'right') {
        console.log('right')
        let calc = slider.scrollLeft + (slide[0].offsetWidth * 2)
        slider.scrollTo({
            left: calc,
            behavior: 'smooth',
        });
    }

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
async function open_movie(id) {
    let main = document.getElementById('main')
    main.className = 'blur_effect'
    movie = await get_movie_from_id(id)
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
function closebutton() {
    let infos_window = document.getElementById('display_movie_infos')
    infos_window.style.display = 'none'
    document.getElementById('main').classList.remove('blur_effect')
}

document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        closebutton();
    }
};

create_best_movie_div('best_movie_image_container');
create_slider('best', 'best_section', 7, best = true);
create_slider('horror', 'horror_section');
create_slider('comedy', 'comedy_section');