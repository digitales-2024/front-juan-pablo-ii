pipeline {
	agent any
	stages {
		stage('Build Nextjs static project') {
			agent {
				docker {
					image 'node:22'
					reuseNode true
				}
			}
			steps {
				
				sh 'npm i'
				sh 'npm run build'
			}
		}
	}
}
