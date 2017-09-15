package assignment

import (
	"html/template"
	"net/http"
	"strconv"
	"time"

	"appengine"
	"appengine/datastore"
)

type Numbers struct {
	X int64
	Y int64
	Sum int64
	Diff int64
	Avg float64
	Date time.Time
}

func init() {
	http.HandleFunc("/",root)
	http.HandleFunc("/sign",sign)
}

func assignmentKey(c appengine.Context)*datastore.Key  {
	return datastore.NewKey(c,"AssignmentOne","default_assignment_one",0,nil)
}

func root(w http.ResponseWriter, r*http.Request) {
	c := appengine.NewContext(r)
	q := datastore.NewQuery("Numbers").Ancestor(assignmentKey(c)).Order("-Date").Limit(10)
	greetings := make([]Numbers,0,10)
	if _, err := q.GetAll(c,&greetings); err != nil {
		http.Error(w,err.Error(),http.StatusInternalServerError)
		return
	}
	if err := assignmentTemplate.Execute(w, greetings); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}


var assignmentTemplate = template.Must(template.New("book").Parse("<html>	<head>			<title>Go Assignment</title>	</head>		<body>	{{range .}}		<p>X: {{.X}}</p>		<p>Y: {{.Y}}</p>	<p>Sum: {{.Sum}}</p>	<p>Diff: {{.Diff}}</p>	<p>Avg: {{.Avg}}</p>	<br>	{{end}}		<form action='/sign' method='post'>			<div><label for='x'>X: </label><input type='text' name='X' id='x'></div>					<div><label for ='y'>Y: </label><input type='text' name='Y' id='y'></div>					<div><input type='submit' value='Submit'></div>				</form>			</body>		</html>"))

func sign(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	x, err := strconv.ParseInt(r.FormValue("X")[0:],10,64);
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	y, err := strconv.ParseInt(r.FormValue("Y")[0:],10,64);
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	sum := x+y
	avg := sum/2
	diff := x-y


	g := Numbers{
		X: x,
		Y: y,
		Sum: sum,
		Diff: diff,
		Avg: float64(avg),
		Date: time.Now(),
	}

	key := datastore.NewIncompleteKey(c, "Numbers",assignmentKey(c))
	_,err = datastore.Put(c, key, &g)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w,r,"/",http.StatusFound)
}
