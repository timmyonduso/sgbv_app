<?php

namespace App\Models;

 use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\RoleName;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
 use Illuminate\Database\Eloquent\SoftDeletes;
 use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;

 class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class, 'survivor_id');
    }

    public function assignedCases()
    {
        return $this->hasMany(CaseModel::class, 'assigned_to');
    }

    public function caseUpdates()
    {
        return $this->hasMany(CaseUpdate::class, 'updated_by');
    }

    public function generatedReports()
    {
        return $this->hasMany(Report::class, 'generated_by');
    }

    // app/Models/User.php
    public function getIsAdminAttribute()
    {
        $isAdmin = $this->hasRole(RoleName::ADMIN);
        Log::info('Checking if user is admin', ['user_id' => $this->id, 'is_admin' => $isAdmin]);
        return $isAdmin;
    }
    public function isAdmin(): bool
    {
        $isAdmin = $this->hasRole(RoleName::ADMIN);
        Log::info('Checking if user is admin', ['user_id' => $this->id, 'is_admin' => $isAdmin]);
        return $isAdmin;
    }

    public function assignRole(RoleName $role): User
    {
        $roleModel = Role::where('name', $role->value)->firstOrFail();

        $this->roles()->attach($roleModel);

        return $this;
    }

     public function roles(): BelongsToMany
     {
         return $this->belongsToMany(Role::class);
     }

    public function hasRole(RoleName $role): bool
    {
        return $this->roles()->where('name', $role->value)->exists();
    }

    public function permissions(): array
    {
        return $this->roles()->with('permissions')->get()
            ->map(function ($role) {
                return $role->permissions->pluck('name');
            })->flatten()->values()->unique()->toArray();
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions(), true);
    }
}
