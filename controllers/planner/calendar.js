const api = require("../../api");

const DUMMY_CLASS_DATA = [
  {
    className: "Klasse 8a",
    classes: [
      {
        subjectId: "biology",
        subjectName: "Biologie",
        topics: [
          {
            id: "Thema 1",
            text: "Thema 1",
            color: "#92DB92",
            utcStartDate: 1534723200000,
            utcEndDate: 1535932799999
          },
          {
            id: "Thema 2",
            text: "Thema 2",
            color: "#92DB92",
            utcStartDate: 1535932800000,
            utcEndDate: 1539561599999
          },
          {
            id: "Thema 3",
            text: "Thema 3",
            color: "#92DB92",
            utcStartDate: 1539561600000,
            utcEndDate: 1541980799999
          }
        ]
      }
    ]
  },
  {
    className: "Klasse 8b",
    classes: [
      {
        subjectId: "biology",
        subjectName: "Biologie",
        topics: [
          {
            id: "Thema 4",
            text: "Thema 4",
            color: "#92DB92",
            utcStartDate: 1534723200000,
            utcEndDate: 1536537599999
          },
          {
            id: "Thema 5",
            text: "Thema 5",
            color: "#92DB92",
            utcStartDate: 1536537600000,
            utcEndDate: 1538956799999
          },
          {
            id: "Thema 6",
            text: "Thema 6",
            color: "#92DB92",
            utcStartDate: 1538956800000,
            utcEndDate: 1542585599999
          }
        ]
      },
      {
        subjectId: "chemistry",
        subjectName: "Chemie",
        topics: [
          {
            id: "Thema 7",
            text: "Thema 7",
            color: "#DBC192",
            utcStartDate: 1534723200000,
            utcEndDate: 1535327999999
          },
          {
            id: "Thema 8",
            text: "Thema 8",
            color: "#DBC192",
            utcStartDate: 1535328000000,
            utcEndDate: 1537747199999
          },
          {
            id: "Thema 9",
            text: "Thema 9",
            color: "#DBC192",
            utcStartDate: 1537747200000,
            utcEndDate: 1540771199999
          }
        ]
      }
    ]
  },
  {
    className: "Klasse 10a",
    classes: [
      {
        subjectId: "chemistry",
        subjectName: "Chemie",
        topics: [
          {
            id: "Thema 10",
            text: "Thema 10",
            color: "#DBC192",
            utcStartDate: 1534723200000,
            utcEndDate: 1537142399999
          },
          {
            id: "Thema 11",
            text: "Thema 11",
            color: "#DBC192",
            utcStartDate: 1537142400000,
            utcEndDate: 1538351999999
          },
          {
            id: "Thema 12",
            text: "Thema 12",
            color: "#DBC192",
            utcStartDate: 1538352000000,
            utcEndDate: 1540771199999
          },
          {
            id: "Thema 13",
            text: "Thema 13",
            color: "#DBC192",
            utcStartDate: 1540771200000,
            utcEndDate: 1543795199999
          }
        ]
      }
    ]
  }
];

const DUMMY_OTHER_DATA = [
  {
    name: "Projektwoche",
    color: "#e9e8e8",
    utcStartDate: 1548633600000,
    utcEndDate: 1548979200000
  }
];

const getUTCDate = date => {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    0
  );
};

const getFederalState = async (req, schoolId) => {
  const schoolData = await api(req).get("/schools/" + schoolId, {
    qs: {
      $populate: ["federalState"]
    }
  });
  return schoolData.federalState.abbreviation;
};
const transfromISODateToUTC = date => getUTCDate(new Date(Date.parse(date)));
const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);
const DAY = 1000 * 60 * 60 * 24;

const getSchoolYear = async (req, stateCode) => {
  const getSommerHolidays = holidays =>
    holidays.find(holiday => holiday.name === "sommerferien");
  const today = new Date();
  const currentYearHolidays = await api(req).get(
    `/holidays?stateCode=${stateCode}&year=${today.getFullYear()}`
  );
  const currentYearSummerHolidays = getSommerHolidays(currentYearHolidays);
  const middleOfSummerHolidays = Math.round(
    (Date.parse(currentYearSummerHolidays.start) +
      Date.parse(currentYearSummerHolidays.end)) /
      2
  );
  if (today.getTime() < middleOfSummerHolidays) {
    const previousYear = today.getFullYear() - 1;
    const previousYearHolidays = await api(req).get(
      `/holidays?stateCode=${stateCode}&year=${previousYear}`
    );
    const previousYearSummerHolidays = getSommerHolidays(previousYearHolidays);
    return {
      utcStartDate: transfromISODateToUTC(previousYearSummerHolidays.end) + DAY,
      utcEndDate: transfromISODateToUTC(currentYearSummerHolidays.start) - DAY
    };
  } else {
    const nextYear = today.getFullYear() + 1;
    const nextYearHolidays = await api(req).get(
      `/holidays?stateCode=${stateCode}&year=${nextYear}`
    );
    const nextYearSummerHolidays = getSommerHolidays(nextYearHolidays);
    return {
      utcStartDate: transfromISODateToUTC(currentYearSummerHolidays.end) + DAY,
      utcEndDate: transfromISODateToUTC(nextYearSummerHolidays.start) - DAY
    };
  }
};

const getHolidaysData = async (req, { schoolYear, stateCode }) => {
  const firstYear = new Date(schoolYear.utcStartDate).getFullYear();
  const secondYear = new Date(schoolYear.utcEndDate).getFullYear();
  const firstYearHolidays = await api(req).get(
    `/holidays?stateCode=${stateCode}&year=${firstYear}`
  );
  const secondYearHolidays = await api(req).get(
    `/holidays?stateCode=${stateCode}&year=${secondYear}`
  );
  const holidays = [...firstYearHolidays, ...secondYearHolidays];

  return holidays
    .map(holiday => ({
      name: capitalizeFirstLetter(holiday.name),
      color: "#FBFFCF",
      utcStartDate: transfromISODateToUTC(holiday.start),
      utcEndDate: transfromISODateToUTC(holiday.end)
    }))
    .filter(
      holiday =>
        holiday.utcEndDate > schoolYear.utcStartDate &&
        holiday.utcStartDate < schoolYear.utcEndDate
    );
};

const handleGetCalendar = async (req, res, next) => {
  const utcToday = getUTCDate(new Date());
  const schoolId = res.locals.currentUser.schoolId;
  const stateCode = await getFederalState(req, schoolId);
  const schoolYear = await getSchoolYear(req, stateCode);
  const holidaysData = await getHolidaysData(req, { schoolYear, stateCode });

  res.render("planner/calendar", {
    title: "Kalender",
    schoolYear: JSON.stringify(schoolYear),
    utcToday,
    classTopicsData: JSON.stringify(DUMMY_CLASS_DATA),
    holidaysData: JSON.stringify(holidaysData),
    otherEventsData: JSON.stringify(DUMMY_OTHER_DATA)
  });
};

module.exports = {
  getCalendar: handleGetCalendar
};
