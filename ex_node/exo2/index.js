const fs = require("node:fs");

// 1. Read File Async
// fs.readFile("./data/student.txt", {encoding: "utf8"}, (err, data) => {
//     if (err) console.log(err)
//     console.log(data)
// })

try {
    const data = fs.readFileSync("./data/student.txt", {encoding: "utf8"});

    // 1. (bis) Read File Sync
    const studentList = JSON.parse(data);

    // 4. Create a new Array of data with the Average
    const studentAverageList = studentList.map((student) => {
        const studentTotal = student.notes.reduce((total, note) => total += note, 0);
        const studentAverage = Math.ceil(studentTotal / student.notes.length);

        return {name: student.name, average: studentAverage, address: student.address}
    })

    // 2. Students >17 Average
    const highAverage = studentAverageList.filter((student) => student.average > 17);
    // console.log("Student with >17 Average:", highAverage);

    // 3. Search Highest Note Student
    const studentHighestList = studentList.map((student) => {
        const studentHighestNote = student.notes.reduce((highest, note) => note > highest ? note : highest, 0);
        return {name: student.name, highest: studentHighestNote, address: student.address}
    })

    const highestNote = studentHighestList.sort((a, b) => b.highest - a.highest)[0];
    // console.log("Student with the highest Note:", highestNote);

    // 5. Order student list by Average (using the new Array from 4.)
    const orderedList = studentAverageList.sort((a, b) => a.average - b.average);
    // console.log("Average Student sorted:", orderedList);

    // Bonus
    const newStudents = [
        {
            name: "Sonia",
            notes: [18],
            address: "Paris"
        },
        {
            name: "Clarisse",
            notes: [17],
            address: "Marseille"
        }
    ]

    const studentsList = [...studentList, ...newStudents];

    fs.writeFileSync("./data/students.txt", JSON.stringify(studentsList));

    const data2 = fs.readFileSync("./data/students.txt", {encoding: "utf8"});

    const newStudentsList = JSON.parse(data2);
    console.table(newStudentsList);

    const upperCasedList = newStudentsList.map((student) => {
        return {
            ...student,
            name: student.name.toUpperCase()
        }
    });

    fs.writeFileSync("./data/students.txt", JSON.stringify(upperCasedList));
} catch(err) {
    console.error(err)
}