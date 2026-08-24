using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBirdMediaAndSpeciesConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IncubationPeriodInDays",
                table: "Species",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaturityAgeInDays",
                table: "Species",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PairingDate",
                table: "Birds",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "Birds",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IncubationPeriodInDays",
                table: "Species");

            migrationBuilder.DropColumn(
                name: "MaturityAgeInDays",
                table: "Species");

            migrationBuilder.DropColumn(
                name: "PairingDate",
                table: "Birds");

            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "Birds");
        }
    }
}
