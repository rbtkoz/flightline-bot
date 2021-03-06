    'use strict'

    const rp = require('minimal-request-promise')
    const botBuilder = require('claudia-bot-builder')
    const fbTemplate = botBuilder.fbTemplate




    function init() {
        return new fbTemplate.generic()
            .addBubble('flugchen','Easily make changes to your flight')
            .addImage('https://www.xing.com/img/custom/events/events_files/1/b/8/1053112/square256/airberlin_Logo_1600x400px.jpg')
            .get()

    }



    function airportMenu() {
        return new fbTemplate.generic()
            .addBubble('At the airport', 'Say goodbye to stress')
            .addButton('Health', 'HEALTH')
            .addButton('Recommendations', 'RECO')
            .addButton('Promotions', 'SALE')
            .get()
    }

    function mainMenu() {
        return new fbTemplate.generic()
            .addBubble('Your Flight', 'Easily make changes to your flight')
            .addButton('Seat Change', 'SEAT')
            .addButton('Upgrade', 'UPGRADE')
            .addButton('Talk to a human', 'HUMAN')
            .addBubble('Your Experience', 'Do what you love now')
            .addButton('Airport Info', 'AIRPORT')
            .addButton('Flight Info', 'FLIGHT')
            .get()
    }

    function seatChange() {
        return new fbTemplate.generic()
            .addBubble('Your seat','Easily change your seat')
            .addButton('Aisle', 'AISLE')
            .addButton('Window','WINDOW')
            .addButton('Sit together', "TOGETHER")
            .get()
    }

    function flightinfo() {
        return new fbTemplate.generic()
            .addBubble('Airberlin','Boarding Pass')
            .addImage('http://www.zylstra.org/wp/wp-content/uploads/2016/01/boarding2-233x300.png')
            .addButton('Yes', 'YESFLIGHT')
            .addButton('No', 'NOFLIGHT')
            .get()
    }


    function healthContent() {

        return new fbTemplate
            .Image('http://big.assets.huffingtonpost.com/sarah-abworkout-005new.gif')
            .get();
    }



    const api = botBuilder((request, originalApiRequest) => {
        console.log(JSON.stringify(request))
        originalApiRequest.lambdaContext.callbackWaitsForEmptyEventLoop = false

        if (!request.postback)
            return rp.get(`https://graph.facebook.com/v2.6/${request.sender}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${originalApiRequest.env.facebookAccessToken}`).then(response => {
                    const user = JSON.parse(response.body)
                    return [
                        init(),
                        `Hi ${user.first_name}.`,
                        "I'm flugchen from airberlin!",
                        "First things first, is this your flight info?",
                        flightinfo()
                    ]
                })



        if (request.text === 'NOFLIGHT')
            return [
               'sorry about that. I am still learning'
                   ]

        if (request.text ==='RECO')
            return [
                'Sorry I am still learning.',
                'I am still making friends with FLIO.'
            ]

        if(request.text ==='SALE')
            return [
                'Sorry I am still learning.',
                'I am still making friends with FLIO.'
            ]


         if (request.text === 'YESFLIGHT')
             return [
                'Your flight boards in 1 hour :)',
                'What can I help you with?',
                mainMenu()
            ]

        if (request.text === 'HUMAN')
            return [
                'Good news, there are only 2 people ahead of you.',
                'I will send you notification when the gate attendant is ready for you :)'
            ]


        if (request.text ==='FLIGHT')
            return [
                'Sorry. I am still learning.',
                "I don't have this knowledge yet"
            ]



        if (request.text === 'UPGRADE') {

            var opt = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'ab16_flightline:4Az8vKgMwOjZHU7DsryP5InoJ19pVCa5'
                }
            };


            return rp.get(`https://xap.ix-io.net/api/v1/airberlin_lab_2016/passengers/2?fields%5Bpassengers%5D=type%2Csalutation%2Cfirst_name%2Clast_name%2Cp_id%2Cdate_of_birth`, opt)
                    .then(response => {
                    const USER = JSON.parse(response.body)
                    return new fbTemplate.Receipt(USER.passenger.salutation + ' ' + USER.passenger.first_name, '1479020289', 'USD', 'Visa 2345')
                        .addTimestamp(new Date(1428444852))
                        .addItem('Upgrade to Business Class')
                        .addSubtitle('Get double the points')
                        .addQuantity(1)
                        .addPrice(635)
                        .addCurrency('USD')
                        .addShippingAddress('1 Hacker Way', '', 'Menlo Park', '94025', 'CA', 'US')
                        .addSubtotal(535.00)
                        .addTax(60.19)
                        .addTotal(595.19)
                        .get();

        })


        }

        if (request.text === 'MAIN_MENU')
            return mainMenu()

        if (request.text === 'HEALTH')
            return healthContent()

        if (request.text ==='AIRPORT')
            return airportMenu()

        if (request.text ==='WINDOW')
            return [
                'Done, your new window seat is',
                '14C'
            ]

        if(request.text === 'AISLE')
            return[
                'Great, your new aisle seat is',
                '14A'
            ]

        if(request.text === 'TOGETHER')
            return[
                'Sorry, this feature is not currently available'
            ]

        if (request.text === 'SEAT') {


            var options = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'ab16_flightline:4Az8vKgMwOjZHU7DsryP5InoJ19pVCa5'
                }
            };


            return rp.get(`https://xap.ix-io.net/api/v1/airberlin_lab_2016/bookings/1?fields%5Bbookings%5D=passengers%2Ccredit_card%2Ccustomer_address%2Cbooking_number%2Cflight_segments%2Cb_id`, options)
                    .then(response => {
                    const APOD = JSON.parse(response.body)
                    return [

                        `"Getting your credit card number: ${APOD.booking.credit_card}`,
                        `Getting your booking number: ${APOD.booking.booking_number}`,
                        `Getting your address: ${APOD.booking.customer_address}`,
                        seatChange()



                    ]
                }
        )
        }



    })

    module.exports = api
