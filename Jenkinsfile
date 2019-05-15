#!/usr/bin/env groovy
//import jenkins.model.Jenkins

pipeline {
    //agent { docker { image 'python:3.5.1' } }
    agent none
    stages {
		stage('pull_image') {
            agent { docker { image 'python:3.5.1' } }
			steps { 
               sh 'echo "pull image"'
			}
		}
		stage('set_version') {
            agent { docker { image 'python:3.5.1' } }
		    steps {
//              script {
//               VAULT_ADDR = envVars['myVar']               
//              }
               echo "THIS iS MY VAULT ADDR: ${env.STRYBER_VAULT_URL}"
			 }
		}
        stage('push_registry') {
            agent { docker { image 'python:3.5.1' } }
            steps {
                sh 'python --version'
            }
        }
    }
}
//def envVars = Jenkins.instance.getGlobalNodeProperties()[0].getEnvVars() 

