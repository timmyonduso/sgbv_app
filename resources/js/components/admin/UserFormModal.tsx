import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Mail,
    Phone,
    Shield,
    Save,
    X,
    UserPlus,
    Edit
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface User {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    department?: string;
    notes?: string;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    user?: User | null;
    roles: string[];
    isEditing?: boolean;
}

export default function UserFormModal({
                                          isOpen,
                                          onClose,
                                          onSave,
                                          user,
                                          roles,
                                          isEditing = false
                                      }: UserFormModalProps) {
    const [formData, setFormData] = useState<User>({
        name: '',
        email: '',
        phone: '',
        role: 'viewer',
        status: 'active',
        department: '',
        notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user && isEditing) {
            setFormData(user);
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'viewer',
                status: 'active',
                department: '',
                notes: ''
            });
        }
        setErrors({});
    }, [user, isEditing, isOpen]);

    const handleInputChange = (field: keyof User, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSave(formData);
            onClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: 'viewer',
            status: 'active',
            department: '',
            notes: ''
        });
        setErrors({});
        onClose();
    };

    const getRoleColor = (role: string) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-800',
            manager: 'bg-blue-100 text-blue-800',
            caseworker: 'bg-green-100 text-green-800',
            viewer: 'bg-yellow-100 text-yellow-800',
        };
        return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status: string) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            suspended: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Edit className="h-5 w-5 text-blue-600" />
                                Edit User
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5 text-green-600" />
                                Add New User
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter full name"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="user@example.com"
                                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                        className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    value={formData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    placeholder="e.g., Social Services"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role and Status */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Role & Status
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="role">User Role *</Label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-2">
                                    <Badge className={getRoleColor(formData.role)}>
                                        {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="status">Account Status</Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive' | 'suspended')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                                <div className="mt-2">
                                    <Badge className={getStatusColor(formData.status)}>
                                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Add any additional notes about this user..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isEditing ? 'Save Changes' : 'Add User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
