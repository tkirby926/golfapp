var  ProfHelper = (function() {

    const data = [
        [],
        [],
        [],
        [],
        ["Less than 75", "75-85", "85-95", "95-105", "105-115", "115+"],
        [],
        ["Always", "Sometimes", "Never"],
        ["Always", "Sometimes", "Never"],
        [],
        [],
        [],
        ["Serious", "Here to have fun"],
        [],
        ["No wagering", "Occassional Wagering", "Frequent Wagering"],
        ["Always Walk", "Most of the Time Walk", "Half and Half", "Most of the time cart", "Always cart"]

    ];

    function getAns(index, value) {
        return data[index][value - 'a'];
    }

    return {
        getAns: getAns
    }
})();

export default ProfHelper;