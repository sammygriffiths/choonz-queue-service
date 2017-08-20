# # encoding: utf-8

# Inspec test for recipe choonz-queue-service::kafka

# The Inspec reference, with examples and extensive documentation, can be
# found at http://inspec.io/docs/reference/resources/

describe bash('java -version') do
    its('exit_status') { should eq 0 }
end

describe file('/opt/kafka/') do
    it { should exist }
    it { should be_directory }
end

describe file('/opt/kafka/bin/kafka-topics.sh') do
    it { should exist }
    it { should be_executable }
end

describe host('zookeeper', port: 2181, protocol: 'tcp') do
    it { should be_reachable }
end

describe service('kafka') do
    it { should be_installed }
    it { should be_enabled }
    it { should be_running }
  end
  