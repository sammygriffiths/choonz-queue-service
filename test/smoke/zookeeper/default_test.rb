# # encoding: utf-8

# Inspec test for recipe choonz-queue-service::zookeeper

# The Inspec reference, with examples and extensive documentation, can be
# found at http://inspec.io/docs/reference/resources/

describe file('/opt/zookeeper/') do
    it { should exist }
    it { should be_directory }
end

describe file('/opt/zookeeper/bin/zkServer.sh') do
    it { should exist }
    it { should be_executable }
end

describe port(2181) do
    it { should be_listening }
end

describe bash('/opt/zookeeper/bin/zkServer.sh status') do
    its('exit_status') { should eq 0 }
end
  

  