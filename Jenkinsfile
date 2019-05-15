#!/usr/bin/env groovy
//import jenkins.model.Jenkins

pipeline {
    //agent { docker { image 'python:3.5.1' } }
    agent none
    stages {
        stage('fetch data from Vault') {
             steps {
               script {
                 // Assign Vault secrets to env variables
                 def secrets = [
                   [$class: 'VaultSecret', path: 'kv/woody/dev/ecr-api', secretValues: [
                   [$class: 'VaultSecretValue', envVar: 'registry_id', vaultKey: 'registry_id'],
                   [$class: 'VaultSecretValue', envVar: 'registry_url', vaultKey: 'registry_id']
                   ]]
                 ]

                 def configuration = [$class: 'VaultConfiguration',
                                vaultUrl: "${env.STRYBER_VAULT_URL}",
                                vaultCredentialId: 'vault-app-token']
                 // Wrapper to avail env variables
                 wrap([$class: 'VaultBuildWrapper', vaultSecrets: secrets]) {
                   sh 'echo $registry_id'
                   sh 'echo $registry_url'
                   }
                 }
           }
        }
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
def notifySlack(text, channel) {
	withCredentials([string(credentialsId: 'slack-webhook-url', variable: 'slackHook')]) {
		def payload = "{\"text\":\"${text}\","
		payload += "\"channel\":\"${channel}\","
		payload += "\"username\":\"${Jenkins}\","
		payload += "\"attachments\":[]}"
		sh "curl -X POST --data-urlencode \'payload=${payload}\' ${slackHook}"
	}
}
