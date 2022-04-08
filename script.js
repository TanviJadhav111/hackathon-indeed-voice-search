var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);

speechRecognitionList.addFromString("in", 1);

let lang = "en-IN"
const urlParams = new URLSearchParams(location.search);
if (urlParams.has('lang') && urlParams.get('lang') == "hi")
{
    lang = "hi-IN"
}

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = lang;
recognition.interimResults = true;
recognition.maxAlternatives = 1;

var word_translation = {
    'मुंबई':'mumbai',
    'हैदराबाद':'hyderabad',
    "चेन्नई":'chennai',
    "सरकारी": "government",
    "नौकरी": "job",
    "जॉब": "job"
}

var stopwords = ['jobs','job','for','in','from','with','i','am','want','looking','the','show','me', 'to', 'and', 'the']

var jobTypeList = ['full time', 'contract', 'temporary', 'part time', 'freshers','fresher','internship', 'intern']
var jtMap = {'full time': 'fulltime',
    'fulltime': 'fulltime',
    'contract': 'contract',
    'temporary':'temporary',
    'part time': 'parttime',
    'fresher': 'fresher',
    'freshers': 'fresher',
    'intern' : 'internship',
    'internship' : 'internship'
}
var jt = null

var remoteList = ['remote', 'temporary remote', 'work from home' , 'working from home']
var remoteMap = {'temporary remote': '7e3167e4-ccb4-49cb-b761-9bae564a0a63',
    'remote' : '032b3046-06a3-4876-8dfd-474eb5e7ed11',
    'work from home' : '032b3046-06a3-4876-8dfd-474eb5e7ed11',
    'working from home': '032b3046-06a3-4876-8dfd-474eb5e7ed11',
    'temporarily remote': '7e3167e4-ccb4-49cb-b761-9bae564a0a63'}
var remotejob = null;

var ageList = ['last 24 hours', 'within 24 hours', 'one day', 'today', 'one week','last week', 'this week','last 3 days', 'last 7 days', 'last 14 days', 'latest', 'new', 'newest', 'most recent']
var ageMap = {'last 24 hours' : 1,
    'today':1,
    'one day': 1,
    'one week':1,
    'last 3 days' : 3,
    'last 7 days': 7,
    'last week':7,
    'this week':7,
    'last 14 days': 14,
    'latest': 1,
    'new': 1,
    'newest': 1,
    'most recent': 1}
var fromage = null

var educationList = ['12th pass', '12th', '10th pass', '12 pass', 'hsc pass', 'hsc','high school', '10 pass', '10', '10th', 'ssc pass', 'ssc', 'bachelor degree', 'bachelors degree' ,'bachelors', 'bachelor', 'master degree', 'masters degree','masters', 'master', 'diploma', 'doctorate' ,'phd']
var educationMap = {'12th pass' : 'FCGTU', '12th' : 'FCGTU', '12 pass': 'FCGTU', 'high school': 'FCGTU', 'hsc pass': 'FCGTU', 'hsc': 'FCGTU',
    '10th pass': 'RDUYT', '10th' : 'RDUYT', '10 pass' : 'RDUYT', '10' : 'RDUYT', 'ssc' : 'RDUYT', 'ssc pass' : 'RDUYT',
    'bachelor degree' : 'HFDVW', 'bachelors degree' :'HFDVW' , 'bachelors' :'HFDVW', 'bachelor' :'HFDVW',
    'master degree' : 'EXSNN', 'masters degree' :'EXSNN','masters' :'EXSNN', 'master' :'EXSNN',
    'diploma': 'UTPWG',
    'doctorate' : '6QC5F','phd' :'6QC5F'}
var taxo3 = null

var taxo1List = ['java', 'javascript', 'html' , 'angular', 'angular js', 'angularjs', 'react' , 'python']
var taxo1Map = {'java': 'EVPJU',
    'jayascript':'JB2WC',
    'html':'Y7U37',
    'angular':'NGEEK',
    'angularjs':'NGEEK',
    'angular js':'NGEEK',
    'react':'X62BT',
    'python':'X62BT'
}
var taxo1 = null

var what = null

const mic = document.querySelector('.mic');

mic.onmousedown = function() {
    recognition.start();
}

let level = 30;
let isProcessing = false;
let speechResult = "";

recognition.onspeechstart = function (event) {
    isProcessing = true
    requestAnimationFrame(function log() {
        if (isProcessing) {
            level = level - 1;
            mic.style.setProperty('--border', `${level}px`);
            requestAnimationFrame(log);
        }
    });
}


recognition.onresult = function(event) {
    speechResult = event.results[0][0].transcript.toLowerCase();
    document.querySelector('#level span').textContent = speechResult;
    if (event.results[0].isFinal){
        process();
        reset();
    } else {
        level = 30;
    }
}

function processWhatWord(value) {
    if (!stopwords.includes(value))
    {
        what = what + value + " ";
    }
}

function removeStopWords() {
    var what_words = what.split(" ")
    what = ""
    what_words.forEach(processWhatWord)
}

function translate() {
    Object.keys(word_translation).forEach(function(key) {
        what = what.replaceAll(key, word_translation[key])
    })
    document.querySelector('#translation span').textContent = what;
}

function findJobType(value) {
    if (what.includes(value))
    {
        what = what.replace(value, '')
        jt = jtMap[value]
    }
}

function findRemote(value) {
    if (what.includes(value))
    {
        what = what.replace(value, '')
        remotejob = remoteMap[value]
    }
}

function findAge(value) {
    if (what.includes(value))
    {
        what = what.replace(value, '')
        fromage = ageMap[value]
    }
}

function findEducation(value) {
    if (what.includes(value))
    {
        what = what.replace(value, '')
        taxo3 = educationMap[value]
    }
}

function findTaxo1(value) {
    if (what.includes(value)){
        taxo1 = taxo1Map[value]
    }
}

function reset() {
    isProcessing = false;
    level = 30
    speechResult = false;
    mic.style.setProperty('--border', `${1}px`);
}

function process() {
    // var stringList = speechResult.split("in");
    what = speechResult;
    if (urlParams.get('lang') == "hi") {
        translate();
    }
    jobTypeList.forEach(findJobType);
    remoteList.forEach(findRemote);
    ageList.forEach(findAge);
    educationList.forEach(findEducation);
    taxo1List.forEach(findTaxo1);
    removeStopWords();
    if (what.trim().length<1 || what === null) {
        what = 'jobs'
    }
    // var when = stringList.length > 1 ? stringList[1].trim() : "" ;
    const myUrlWithParams = new URL("https://in.indeed.com/jobs");

    // stopwords.forEach(removeStopWords)

    //if (hindi_city.c
    myUrlWithParams.searchParams.append("q", what);
    if(jt != null) {
        myUrlWithParams.searchParams.append("jt", jt);
    }
    if (remotejob != null)
    {
        myUrlWithParams.searchParams.append("remotejob", remotejob);
    }
    if (fromage != null)
    {
        myUrlWithParams.searchParams.append("fromage", fromage);
    }
    if (taxo3 != null)
    {
        myUrlWithParams.searchParams.append("taxo3", taxo3);
    }
    if (taxo1 != null)
    {
        myUrlWithParams.searchParams.append("taxo1", taxo1);
    }
    // myUrlWithParams.searchParams.append("l", when);

    //console.log(myUrlWithParams.toString());
    window.location.href = myUrlWithParams;
}


// java developer internship in Banglore
// show me latest sales executive jobs in Pune
// i am 12th pass and i want to work from home
// सरकारी नौकरी मुंबई

