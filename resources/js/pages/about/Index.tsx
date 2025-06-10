import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Shield,
    Heart,
    Users,
    Target,
    Eye,
    Compass,
    Phone,
    Mail,
    Clock,
    Award,
    HandHeart
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'About Us',
        href: '/about',
    },
];

export default function AboutUs() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About Us" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Hero Section */}
                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                    <CardContent className="p-8">
                        <div className="text-center">
                            <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                GBV Case Management System
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Empowering organizations to provide comprehensive support and justice
                                for survivors of gender-based violence through efficient case management
                                and coordinated response.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Mission, Vision, Values */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border-blue-200">
                        <CardHeader className="text-center">
                            <Target className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                            <CardTitle className="text-2xl text-blue-800">Our Mission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 text-center">
                                To provide a secure, efficient, and survivor-centered platform that
                                streamlines case management processes, ensuring every survivor receives
                                timely, coordinated, and compassionate support while maintaining the
                                highest standards of confidentiality and data protection.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200">
                        <CardHeader className="text-center">
                            <Eye className="h-12 w-12 text-green-600 mx-auto mb-2" />
                            <CardTitle className="text-2xl text-green-800">Our Vision</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 text-center">
                                A world where all survivors of gender-based violence have access to
                                comprehensive, coordinated support services, and where organizations
                                are equipped with the tools they need to provide effective,
                                trauma-informed care.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200">
                        <CardHeader className="text-center">
                            <Compass className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                            <CardTitle className="text-2xl text-purple-800">Our Values</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-gray-600 space-y-2">
                                <li className="flex items-center">
                                    <Heart className="h-4 w-4 text-red-500 mr-2" />
                                    Survivor-centered approach
                                </li>
                                <li className="flex items-center">
                                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                                    Privacy and confidentiality
                                </li>
                                <li className="flex items-center">
                                    <Users className="h-4 w-4 text-green-500 mr-2" />
                                    Collaborative partnerships
                                </li>
                                <li className="flex items-center">
                                    <Award className="h-4 w-4 text-yellow-500 mr-2" />
                                    Professional excellence
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Key Features */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-gray-800 mb-4">
                            What We Provide
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="text-center p-4">
                                <Users className="h-10 w-10 text-indigo-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-lg mb-2">Case Management</h3>
                                <p className="text-gray-600 text-sm">
                                    Comprehensive tracking and management of survivor cases from
                                    initial report through resolution.
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <Shield className="h-10 w-10 text-green-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-lg mb-2">Secure Platform</h3>
                                <p className="text-gray-600 text-sm">
                                    Enterprise-grade security ensuring sensitive information
                                    remains protected and confidential.
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <Clock className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-lg mb-2">Real-time Tracking</h3>
                                <p className="text-gray-600 text-sm">
                                    Monitor case progress, response times, and outcomes
                                    with comprehensive analytics.
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <HandHeart className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-lg mb-2">Multi-agency Coordination</h3>
                                <p className="text-gray-600 text-sm">
                                    Facilitate collaboration between service providers,
                                    legal teams, and support organizations.
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <Target className="h-10 w-10 text-red-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-lg mb-2">Outcome Tracking</h3>
                                <p className="text-gray-600 text-sm">
                                    Measure impact and effectiveness of interventions
                                    with detailed reporting capabilities.
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <Award className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-lg mb-2">Best Practices</h3>
                                <p className="text-gray-600 text-sm">
                                    Built following international standards and
                                    trauma-informed care principles.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-gray-800 mb-4">
                            Our Impact
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                                <div className="text-gray-600">Cases Managed</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                                <div className="text-gray-600">Partner Organizations</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                                <div className="text-gray-600">System Availability</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-red-600 mb-2">98%</div>
                                <div className="text-gray-600">User Satisfaction</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-800">Get Support</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">24/7 Support Hotline</p>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Email Support</p>
                                    <p className="text-gray-600">support@gbvmanagement.org</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-medium">Response Time</p>
                                    <p className="text-gray-600">Within 2 hours during business hours</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-800">Training & Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Award className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <p className="font-medium">Staff Training Programs</p>
                                    <p className="text-gray-600">Comprehensive onboarding and ongoing education</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Users className="h-5 w-5 text-indigo-600" />
                                <div>
                                    <p className="font-medium">User Community</p>
                                    <p className="text-gray-600">Connect with other organizations and share best practices</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Shield className="h-5 w-5 text-red-600" />
                                <div>
                                    <p className="font-medium">Security Guidelines</p>
                                    <p className="text-gray-600">Regular updates on data protection and privacy</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-xl mb-6 opacity-90">
                            Join organizations worldwide in providing better support for GBV survivors.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                Contact Our Team
                            </button>
                            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                                Schedule a Demo
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
