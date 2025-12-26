'use client';

import React from 'react';
import { Input } from '@/design-system/features/common/input';
import { UserIcon, Mail, Lock, KeyRound, ShieldCheck } from 'lucide-react';

export default function TailwindVariantsInputDemo() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Input Component with Tailwind Variants</h1>
      <p className="mb-8 text-gray-600">This demo showcases the Input component refactored using the tailwind-variants library</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Basic Variants</h2>
          <Input
            label="Outlined Input"
            variant="outlined"
            placeholder="Outlined variant"
          />
          <Input
            label="Filled Input"
            variant="filled"
            placeholder="Filled variant"
          />
          <Input
            label="Standard Input"
            variant="standard"
            placeholder="Standard variant"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">With Icons</h2>
          <Input
            label="With Icon"
            variant="outlined"
            icon={<UserIcon className="text-gray-400" size={18} />}
            placeholder="Username"
          />
          <Input
            label="Password Input"
            variant="outlined"
            type="password"
            placeholder="Enter password"
          />
          <Input
            label="Custom Password Icon"
            variant="outlined"
            type="password"
            placeholder="Enter password"
            rightIcon={<KeyRound className="text-gray-400" size={18} />}
          />
          <Input
            label="Password No Toggle"
            variant="filled"
            type="password"
            placeholder="Enter password"
            showPasswordToggle={false}
            rightIcon={<ShieldCheck className="text-gray-400" size={18} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Floating Labels</h2>
          <Input
            label="First Name"
            variant="outlined"
            placeholder="John"
            floatingLabel
          />
          <Input
            label="Last Name"
            variant="filled"
            placeholder="Doe"
            floatingLabel
          />
          <Input
            label="Phone Number"
            variant="standard"
            placeholder="(555) 123-4567"
            floatingLabel
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Underline Variants</h2>
          <Input
            label="Filled + UnderLine"
            variant="filled"
            placeholder="Only bottom border"
            underLine
            floatingLabel
          />
          <Input
            label="Filled + Icon + UnderLine"
            variant="filled"
            icon={<UserIcon className="text-gray-400" size={18} />}
            placeholder="With icon"
            underLine
            floatingLabel
          />
          <Input
            label="Outlined + UnderLine"
            variant="outlined"
            placeholder="Outlined becomes underlined"
            underLine
            floatingLabel
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">States</h2>
          <Input
            label="Required Input"
            variant="outlined"
            placeholder="This field is required"
            required
          />
          <Input
            label="Disabled Input"
            variant="outlined"
            placeholder="This field is disabled"
            disabled
            value="Disabled value"
          />
          <Input
            label="With Error"
            variant="outlined"
            placeholder="Error example"
            error="This field has an error"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Adornments</h2>
          <Input
            label="Currency"
            variant="outlined"
            startAdornment={<span className="text-gray-500">$</span>}
            placeholder="0.00"
          />
          <Input
            label="Domain"
            variant="standard"
            startAdornment={<span className="text-gray-500">https://</span>}
            endAdornment={<span className="text-gray-500">.com</span>}
            placeholder="example"
          />
          <Input
            label="Twitter Username"
            variant="outlined"
            startAdornment={<span className="text-gray-500">@</span>}
            placeholder="username"
            floatingLabel
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold border-b pb-2">Login Form Example</h2>
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-4">
          <form className="space-y-4">
            <Input
              label="Email"
              variant="filled"
              floatingLabel={false}
              underLine
              fullWidth
              icon={<Mail className="text-gray-400" size={18} />}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              variant="filled"
              type="password"
              floatingLabel={false}
              underLine
              fullWidth
              rightIcon={<Lock className="text-gray-400" size={18} />}
            />
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 