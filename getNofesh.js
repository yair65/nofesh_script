const searchAndOrder = () => { 

// change these 
const desiredHotelName = 'כרמים 2022'
const desiredStartDate = new Date("2022-04-07T00:00:00");
const desiredEndDate = new Date("2022-04-10T00:00:00");
const desiredStartingWeekday = ['ה', 'ו'];

return fetch("https://nofesh.prat.idf.il/SearchDeals/SearchAvilableDeals", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "Referer": "https://nofesh.prat.idf.il/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": `FromDate=2022-03-13T22%3A00%3A00.000Z&ToDate=2022-09-01T21%3A00%3A00.000Z&RegionOrHotel=&PageNum=0&HotelType=1&FromFlexibility=false&ToFlexibility=false&FamilyComposition%5BAdults%5D=2&FamilyComposition%5BChildren%5D=0&FamilyComposition%5BInfants%5D=0`,
    "method": "POST"
}).then(response => response.json()).then(body => {
    console.log(body)
    const validatedHotelId = body.Content.find((hotel) => {
        const isName = hotel.HotelName === desiredHotelName;
        
        const hotelStartDate = new Date(hotel.FromDate);
        const isStartDate = hotelStartDate >= desiredStartDate;
        const hotelEndDate = new Date(hotel.ToDate);
        const isEndDate = hotelEndDate <= desiredEndDate;
        
        const isGoodWeekDay = desiredStartingWeekday.includes(hotel.FromDay)
        
        return isName && isStartDate && isEndDate && isGoodWeekDay;
    }).ID
    
    
    console.log(validatedHotelId)

    fetch("https://nofesh.prat.idf.il/SearchDeals/CreateNewReservation", {
        "headers": {
            "accept": "*/*",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://nofesh.prat.idf.il/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `DealId=${validatedHotelId}&HotelTypeId=0&SelectedNumOfExtraPayingNights=0&Adults=2&Children=0&Infants=0&PaymentsNumber=1`,
        "method": "POST"
    }).then(response => response.json()).then(body => {console.log(body); return body.IsValid});
    
    
}
);
}

const orderIfReady = async () => {
    try {
        
        const areWeReady = (new Date)>= new Date("2022-03-15T17:59:50+02:00");
        if(areWeReady) {
            const finished = await searchAndOrder();
            if(finished) {
                console.log('***Success!***');
                clearInterval(interval)
            };
        }
    } catch (error) {
        console.error(error)
    }


}


const interval = setInterval(orderIfReady, 1000)
