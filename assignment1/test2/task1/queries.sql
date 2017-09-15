-- Question 1
SELECT *
FROM [s3542413-cc2017-go:assignment.diabetes]
WHERE result = 'positive'
AND (age > 50 OR bmi < 30);

-- Question 2
SELECT count(*)
FROM [s3542413-cc2017-go:assignment.diabetes]
WHERE result = 'negative'
AND dbp BETWEEN 80 AND 90;

-- Question 3
SELECT age, bmi, glucose, result
FROM [s3542413-cc2017-go:assignment.diabetes]
WHERE insulin = 0
AND result = 'positive';

-- Question 4
SELECT age, bmi, dbp, result
FROM [s3542413-cc2017-go:assignment.diabetes]
ORDER BY glucose DESC
LIMIT 20;
