async function fetch_data(id) {
    try {
        const url = get_url(id);
        const response = await fetch(url);
        const status = response.status;
        const ok = response.ok;
        if (status === 429) {
            return {
                status: false,
                error_message: 'Too many requests',
                data: undefined
            }
        }
        if (ok === false) {
            return {
                status: false,
                error_message: 'Failed to load data',
                data: undefined
            }
        }
        const data = await response.text();
        if (data.split('\n') <= 0) {
            return {
                status: false,
                error_message: 'Data is not valid',
                data: undefined
            }
        }
        return {
            status: true,
            error_message: 'none',
            data: data
        }


    } catch (err) {
        console.log(err)
        return {
            status: false,
            error_message: 'Failed. ',
            data: undefined
        }
    }
}

function get_subjects_json(data) {
    data = data.split('\n');
    let output = [];
    for (let index = 1; index < data.length; index++) {
        const [title, category, rtl, mcq, branch, url, id, number] = data[index].split(',')
        output.push({
            title: title.replace(/"/g, ''),
            category: category.replace(/"/g, ''),
            rtl: rtl.replace(/"/g, '') === 'TRUE' ? true : false,
            mcq: mcq.replace(/"/g, '') === 'TRUE' ? true : false,
            branch: branch.replace(/"/g, '') === 'TRUE' ? true : false,
            url: url.replace(/"/g, ''),
            id: id.replace(/"/g, ''),
            number: number.replace(/"/g, ''),
        })
    }
    return output
}
function get_categories(data) {
    data = data.split('\n');
    let output = [];
    for (let index = 1; index < data.length; index++) {
        const [title, id, url, has_updates, details] = data[index].split(',')
        output.push({
            title: title.replace(/"/g, ''),
            url: url.replace(/"/g, ''),
            id: id.replace(/"/g, ''),
            has_updates: has_updates.replace(/"/g, '') === 'TRUE' ? true : false,
            details: details.replace(/"/g, ''),
        })
    }
    return output
}
async function get_data() {
    const { data } = await fetch_data('1J9B9-Jbs8c4iUury3ds4ktZj7Mjn6I7gk1l6RHT5f0w')
    const categories = get_categories(data);
    const urls = [];
    categories.forEach(item => {
        urls.push(fetch(get_url(item.url)))
    });
    const all_quizzes = await Promise.all(urls);
    let all_quizzes_json = await Promise.all(all_quizzes.map(res => res.text()));
    all_quizzes_json = all_quizzes_json.map(item => get_subjects_json(item));
    for (let index = 0; index < categories.length; index++) {
        categories[index].quizzes = all_quizzes_json[index]
    }
    return {
        status: true,
        error_message: 'None',
        data: categories
    }
}
async function get_titles(id = "1yc8lsy3-5naSrOBB7ilcjG1hDWPzMutjH-WKQ1rGvR0") {
    const titles = await fetch_data(id);
    if (titles.status === false) {
        return {
            status: false,
            error_message: 'Data is not valid',
            data: undefined
        }
    }
    const home_data = get_subjects_json(titles.data)
    if (Array.isArray(home_data) === false) {
        return {
            status: false,
            error_message: 'Data is not valid',
            data: undefined
        }
    }
    return {
        status: true,
        error_message: 'None',
        data: home_data
    };
}



function get_quiz_json(data) {
    data = data.split('\n');
    let output = [];
    for (let index = 1; index < data.length; index++) {
        const [question, choice1, choice2, choice3, choice4, choice5, explanation] = data[index].split(',')
        const choices = shuffle(
            [
                choice1,
                choice2,
                choice3,
                choice4,
                choice5
            ].map(c => c.replace(/"/g, '')).filter((c) => c !== "-")
        )
        output.push({
            question: question.replace(/"/g, ''),
            choices,
            right_answer: choice1.replace(/"/g, ''),
            review: false,
            explanation: explanation.replace(/"/g, ''),
            user_answer: '',
            id: generate_unique_id()
        })
    }
    return shuffle(output)
}
async function get_quiz(id) {
    const quiz = await fetch_data(id);
    if (quiz.status === false) {
        return {
            status: false,
            error_message: 'Data is not valid',
            data: undefined
        }
    }
    const quiz_data = get_quiz_json(quiz.data);
    return {
        status: true,
        error_message: 'None',
        data: quiz_data
    };
}



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function generate_unique_id() {
    function chr4() {
        return Math.random().toString(16).slice(-4);
    }
    return (
        chr4() +
        chr4() +
        "-" +
        chr4() +
        "-" +
        chr4() +
        "-" +
        chr4() +
        "-" +
        chr4()
    );
}
function get_url(id) {
    const base = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;
    const query = encodeURIComponent("Select *");
    const url = `${base}&stq=${query}`;
    return url;
}
export { get_titles, get_quiz, get_data }