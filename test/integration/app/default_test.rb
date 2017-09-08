# # encoding: utf-8

# Inspec test for recipe choonz-queue-service::app

# The Inspec reference, with examples and extensive documentation, can be
# found at http://inspec.io/docs/reference/resources/

describe bash('node -v') do
  its('exit_status') { should eq 0 }
  its('stdout') { should match /8\.\d\.\d/ }
end

describe directory('/var/www/app') do
  it { should exist }
end

describe file('/var/www/app/src/bin/www') do
  it { should exist }
end

describe service('choonz-queue') do
  it { should be_installed }
  it { should be_enabled }
  it { should be_running }
end

describe port(3000) do
  it { should be_listening }
  its('processes') {should include 'node'}
end
