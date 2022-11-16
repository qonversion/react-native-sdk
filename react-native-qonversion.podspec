require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-qonversion"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-qonversion
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-qonversion"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-qonversion.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "QonversionSandwich", "0.2.1"
end
