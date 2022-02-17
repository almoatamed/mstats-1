

const random_names = [
    'ahmad', 'mohammad', 'yasmin', 'moyasser', 'fisal', 'fadil', 'fauzi', 'zaher', 'naser',
    'karim', 'younis', 'loay', 'reyad', 'nader', 'wajeeh', 'mohanned', 'ramez', 'samir', 
    'yaser', 'majed', 'majeed', 'ramadan', 'said', 'musa', 'yousef', 'abdolrahaman', 'abdolqader', 
]

module.exports = function (n) {
    let name = []
    for (let i = 0; i <n ; i++) {
        name.push(random_names[Math.floor(Math.random()*random_names.length)])
    }
    return name.join(' ')
}