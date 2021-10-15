var express = require('express');
var router = express.Router();
var Student = require('./student-model');

router.post('/', (req, res) => {
    console.log(req.body)
    let generic_student = new Student();

    generic_student.name = req.body.name;
    generic_student.g1 = req.body.g1;
    generic_student.g2 = req.body.g2;
    generic_student.g3 = req.body.g3;
    generic_student.matriculation = req.body.matriculation;

    let average = ((generic_student.g1 + generic_student.g2 + generic_student.g3) / 3)
    generic_student.average = average;

    if (average >= 6) generic_student.status = "APPROVED"
    else generic_student.status = "DISAPPROVED"

    console.log(generic_student)

    generic_student.save((err, temp) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(temp)
        }
    })
});

router.get('/', (req, res) => {
    Student.find().exec((err, temp) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(temp)
        }
    })
});

router.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;

        await Student.deleteOne({ _id: id });
        console.log("DELETED ID: " + id)
        res.status(200).send({});
    }
    catch (err) {
        res.status(500).send({ msg: 'Internal Error', error: err })
    }
});

router.patch('/:student', (req, res) => {
    let generic_student = JSON.parse(req.params.student)
    console.log(generic_student)
    Student.findById(generic_student._id, (err, temp) => {
        if (err) {
            res.status(500).send(err)
        }
        else if (!temp) {
            res.status(404).send({})
        }
        else {
            temp.name = generic_student.name;
            temp.g1 = generic_student.g1;
            temp.g2 = generic_student.g2;
            temp.g3 = generic_student.g3;
            temp.matriculation = generic_student.matriculation;
            temp.average = ((generic_student.g1 + generic_student.g2 + generic_student.g3) / 3);
            if (temp.average  >= 6) generic_student.status = "APPROVED"
            else generic_student.status = "DISAPPROVED"
            temp.status = generic_student.status;
            temp.save()
                .then((temp) => {
                    res.status(200).send((temp))
                })
                .catch((err) => {
                    res.status(500).send((err))
                })
        }
    })
});

module.exports = router;