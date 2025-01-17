<?php
include_once '../config.php';

$responseId = "custom-$sessionId";
/*$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "showCorrectAnswers": true,
    "questions": [
        {
          "response_id": "' . $responseId . '",
          "type": "custom",
          "stimulus": "Stimulus of the custom question",
          "js": {
            "question": "https://serolearn.com/learnosity/question.js",
            "scorer": "https://serolearn.com/learnosity/scorer.js"
          },
          "sero_assessment_id": "bc970537e092f2e973bae5557a354469",
          "css": "https://serolearn.com/learnosity/question.css",
          "instant_feedback": true
        }
    ]
}';*/


$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "showCorrectAnswers": true,
    "questions": [
        {
          "response_id": "' . $responseId . '",
          "type": "custom",
          "stimulus": null,
          "js": {
            "question": "/dist/question.js",
            "scorer": "/dist/scorer.js"
          },
          "sero_assessment_id": "2a739e5243fca22972d8ad11da5614e9",
          "css": "/dist/question.css",
          "instant_feedback": true
        }
    ]
}';

// ske with every item type: "1e0304c13a9794db6f56b67af10e2711",
// declaration of independence map: "cde2d90fb4cf318063175665088369c1", 

// reusable BAM ID: bc970537e092f2e973bae5557a354469
// DEMO SKE ID: 2a739e5243fca22972d8ad11da5614e9
// DEMO BAM ID: c51bc863f360287e350ef419012a09e4

$requestData = json_decode($request, true);
$signedRequest = signAssessmentRequest($requestData);

## Pull sero assessment object in data call

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Questions API - Skeleton</title>
    <script src="//questions.staging.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
    </style>
</head>
<body>

    <div class="client-question-info">
        Response ID: <code><?php echo $responseId; ?></code>
    </div>

    <div class="learnosity-response question-<?php echo $responseId; ?>"></div>

    <div class="client-save-wrapper">
        <span class="learnosity-save-button"></span>
    </div>

    <div id="redirect_response" class="client-hidden">
        Save Successful! Do you want to go to
        <button type="button" class="client-btn" data-action="resume">Resume</button> or
        <button type="button" class="client-btn" data-action="review">Review</button> mode ?
    </div>

    <div class="client-request-json">
        <div><b>Request init options</b></div>
        <textarea readonly></textarea>
    </div>

    <script>
        window.activity = <?php echo $signedRequest; ?>;

        window.questionsApp = LearnosityApp.init(activity, {
            readyListener() {
                console.log('ready');
            },
            errorListener(e) {
                console.error(e);
            },
            saveSuccess(responseIds) {
                console.log('save success', responseIds);

                // for sharedScript.js to display resume/review options
                if (window.__onSaveSuccess) {
                    window.__onSaveSuccess(responseIds);
                }
            },
        });

        <?php echo file_get_contents('../sharedAssessmentScript.js'); ?>


    </script>
</body>
</html>
